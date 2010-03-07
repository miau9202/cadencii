#include "PlaySound2.h"

HWAVEOUT wave_out = NULL;
WAVEFORMATEX wave_format;
WAVEHDR wave_header[NUM_BUF];
DWORD *wave[NUM_BUF];
bool wave_done[NUM_BUF];
int buffer_index = 0; // ���̃f�[�^���������ރo�b�t�@�̔ԍ�
int buffer_loc = 0; // ���̃f�[�^���������ވʒu
CRITICAL_SECTION locker;
bool abort_required;
int block_size = 4410; // �u���b�N�T�C�Y
int block_size_used; // SoundPrepare�ŏ��������ꂽ�u���b�N�T�C�Y

#ifdef __cplusplus
extern "C" {
#endif

void SoundUnprepare() {
    if ( NULL == wave_out ) {
        return;
    }

    EnterCriticalSection( &locker );
    for ( int i = 0; i < NUM_BUF; i++ ) {
        waveOutUnprepareHeader( wave_out,
                                &(wave_header[i]),
                                sizeof( WAVEHDR ) );
        free( wave_header[i].lpData );
    }
    waveOutClose( wave_out );
    wave_out = NULL;
    LeaveCriticalSection( &locker );
}

void SoundInit() {
    InitializeCriticalSection( &locker );
}

void SoundKill() {
    SoundExit();
    DeleteCriticalSection( &locker );
}

double SoundGetPosition() {
    if ( NULL == wave_out ) {
        return -1.0;
    }

    MMTIME mmt;
    mmt.wType = TIME_MS;
    waveOutGetPosition( wave_out, &mmt, sizeof( MMTIME ) );
    float ms = 0.0f;
    switch ( mmt.wType ) {
        case TIME_MS:
            return mmt.u.ms * 0.001;
        case TIME_SAMPLES:
            return (double)mmt.u.sample / (double)wave_format.nSamplesPerSec;
        case TIME_BYTES:
            return (double)mmt.u.cb / (double)wave_format.nAvgBytesPerSec;
        default:
            return -1.0;
    }
    return 0.0;
}

void SoundWaitForExit() {
    if ( NULL == wave_out ) {
        return;
    }

    EnterCriticalSection( &locker );
    // buffer_index��NUM_BUF�����Ȃ�A�܂�1��waveOutWrite���Ă��Ȃ��̂ŁA��������
    if ( buffer_index < NUM_BUF ) {
        for ( int i = 0; i < buffer_index; i++ ) {
            if( abort_required ) break;
            wave_done[i] = false;
            waveOutWrite( wave_out, &(wave_header[i]), sizeof( WAVEHDR ) );
        }
    }

    // �܂���������łȂ��o�b�t�@������ꍇ�A�c�����������
    if ( buffer_loc != 0 ) {
        int act_buffer_index = buffer_index % NUM_BUF;

        // �o�b�t�@���g�p���̏ꍇ�A�g�p�I���ƂȂ�̂�҂��󂯂�
        while ( !wave_done[act_buffer_index] ) {
            if( abort_required ) break;
            Sleep( 0 );
        }

        if( !abort_required ){
            // �㔼������0�Ŗ��߂�
            for ( int i = buffer_loc; i < block_size_used; i++ ) {
                wave[act_buffer_index][i] = MAKELONG( 0, 0 );
            }

            buffer_loc = 0;
            buffer_index++;

            wave_done[act_buffer_index] = false;
            waveOutWrite( wave_out, &wave_header[act_buffer_index], sizeof( WAVEHDR ) );
        }
    }

    // NUM_BUF�̃o�b�t�@���ׂĂ�wave_done�ƂȂ�̂�҂B
    while ( !abort_required ) {
        bool all_done = true;
        for ( int i = 0; i < NUM_BUF; i++ ) {
            if ( !wave_done[i] ) {
                all_done = false;
                break;
            }
        }
        if ( all_done ) {
            break;
        }
    }
    LeaveCriticalSection( &locker );

    // ���Z�b�g����
    SoundExit();
}

void SoundSetResolution( int resolution ){
    block_size = resolution;
}

void SoundAppend( double *left, double *right, int length ) {
    if ( NULL == wave_out ) {
        return;
    }
    EnterCriticalSection( &locker );
    int appended = 0; // �]�������f�[�^�̌�
    while ( appended < length ) {
        // ���̃��[�v���ł́A�o�b�t�@��1�Âf�[�^��]������

        // �o�b�t�@���g�p���̏ꍇ�A�g�p�I���ƂȂ�̂�҂��󂯂�
        int act_buffer_index = buffer_index % NUM_BUF;
        while ( !wave_done[act_buffer_index] && !abort_required ) {
            Sleep( 0 );
        }

        int t_length = block_size_used - buffer_loc; // �]������f�[�^�̌�
        if ( t_length > length - appended ) {
            t_length = length - appended;
        }
        for ( int i = 0; i < t_length && !abort_required; i++ ) {
            wave[act_buffer_index][buffer_loc + i] = MAKELONG( (WORD)(left[appended + i] * 32768.0), (WORD)(right[appended + i] * 32768.0) );
        }
        appended += t_length;
        buffer_loc += t_length;
        if ( buffer_loc == block_size_used ) {
            // �o�b�t�@�������ς��ɂȂ����悤��
            buffer_index++;
            buffer_loc = 0;
            if ( buffer_index >= NUM_BUF ) {
                // �ŏ���NUM_BUF�̃o�b�t�@�́A���ׂẴo�b�t�@�ɓ]�����I���܂�
                // waveOutWrite���Ȃ��悤�ɂ��Ă���̂ŁA������waveOutWrite����B
                if ( buffer_index == NUM_BUF ) {
                    for ( int i = 0; i < NUM_BUF; i++ ) {
                        if( abort_required ) break;
                        wave_done[i] = false;
                        waveOutWrite( wave_out, &wave_header[i], sizeof( WAVEHDR ) );
                    }
                } else {
                    wave_done[act_buffer_index] = false;
                    if( !abort_required ){
                        waveOutWrite( wave_out, &wave_header[act_buffer_index], sizeof( WAVEHDR ) );
                    }
                }
            }
        }
    }
    LeaveCriticalSection( &locker );
}

/// <summary>
/// �R�[���o�b�N�֐��B�o�b�t�@�̍Đ��I�������o���邽�߂Ɏg�p�B
/// </summary>
/// <param name="hwo"></param>
/// <param name="uMsg"></param>
/// <param name="dwInstance"></param>
/// <param name="dwParam1"></param>
/// <param name="dwParam2"></param>
void SoundCallback(
    HWAVEOUT hwo,
    UINT uMsg,
    DWORD dwInstance,
    DWORD dwParam1,
    DWORD dwParam2 ) {
    if ( uMsg != MM_WOM_DONE ) {
        return;
    }

    for ( int i = 0; i < NUM_BUF; i++ ) {
        if ( &wave_header[i] != (WAVEHDR*)dwParam1 ) {
            continue;
        }
        wave_done[i] = true;
        break;
    }
}

/// <summary>
/// �f�o�C�X������������
/// </summary>
/// <param name="sample_rate"></param>
void SoundPrepare( int sample_rate ) {
    // �f�o�C�X���g�p���̏ꍇ�A�g�p���~����
    if ( NULL != wave_out ) {
        SoundExit();
        SoundUnprepare();
    }

    EnterCriticalSection( &locker );
    // �t�H�[�}�b�g���w��
    wave_format.wFormatTag = WAVE_FORMAT_PCM;
	wave_format.nChannels = 2;
    wave_format.wBitsPerSample = 16;
    wave_format.nBlockAlign
        = wave_format.nChannels * wave_format.wBitsPerSample / 8;
    wave_format.nSamplesPerSec = sample_rate;
    wave_format.nAvgBytesPerSec
        = wave_format.nSamplesPerSec * wave_format.nBlockAlign;

    // �f�o�C�X���J��
    waveOutOpen( &wave_out,
                 WAVE_MAPPER,
                 &wave_format,
                 (DWORD_PTR)SoundCallback,
                 NULL,
                 CALLBACK_FUNCTION );

    // �o�b�t�@������
    block_size_used = block_size;
    for ( int i = 0; i < NUM_BUF; i++ ) {
        wave[i] = (DWORD*)malloc( (int)(sizeof( DWORD ) * block_size_used) );
        wave_header[i].lpData = (LPSTR)wave[i];
        wave_header[i].dwBufferLength = sizeof( DWORD ) * block_size_used;
        wave_header[i].dwFlags = WHDR_BEGINLOOP | WHDR_ENDLOOP;
        wave_header[i].dwLoops = 1;
        waveOutPrepareHeader( wave_out, &wave_header[i], sizeof( WAVEHDR ) );

        wave_done[i] = true;
    }

    buffer_index = 0;
    buffer_loc = 0;
    abort_required = false;

    LeaveCriticalSection( &locker );
}

/// <summary>
/// �Đ����Ƃ߂�B
/// </summary>
void SoundExit() {
    if ( NULL != wave_out ) {
        abort_required = true;
        EnterCriticalSection( &locker );
        waveOutReset( wave_out );
        LeaveCriticalSection( &locker );
    }
}

#ifdef __cplusplus
} // extern "C"
#endif