/*
 * main.cpp
 * Copyright © 2011 kbinani
 *
 * This file is part of org.kbinani.cadencii.
 *
 * org.kbinani.cadencii is free software; you can redistribute it and/or
 * modify it under the terms of the GPLv3 License.
 *
 * org.kbinani.cadencii is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
#include "vocaloidrv.h"
#include <process.h>
#include <conio.h>
#include <shlwapi.h>

#pragma comment(lib, "shlwapi.lib")

void print_help();
void load_midi_from_file( FILE *file, unsigned char *midi, int *clock, int *buffer_num, int *clock_num );
// モニター用のディレクトリを監視するスレッド用
unsigned int __stdcall monitor_dir( void *args );

// 合成処理中にモニター用ディレクトリのモニターを行うスレッド
HANDLE gThread = NULL;
bool gAbortMonitorRequested = false;
string gMonitorDir = "";

unsigned int __stdcall monitor_dir( void *args )
{
	vocaloidrv *parent = (vocaloidrv *)args;
    string stop = gMonitorDir + "\\stop";
	while( !gAbortMonitorRequested ){
        // mIsRenderingになるのを待機
        if( !parent->isRendering() ){
#ifdef TEST
            vocaloidrv::println( "::monitor_dir; driver is not rendering; continue" );
            Sleep( 1000 );
#else
            Sleep( 100 );
#endif
            continue;
        }
#ifdef TEST
        vocaloidrv::println( "::monitor_dir; driver state changed to 'Rendering'" );
#endif
        // レンダリング中なので，モニターディレクトリに停止指示を示すファイル「stop」がないかどうかを調べる
        while( !gAbortMonitorRequested && parent->isRendering() ){
            if( PathFileExists( stop.c_str() ) ){
#ifdef TEST
                vocaloidrv::println( "::monitor_dir; calling requestStopRendering..." );
#endif
                // 停止要求を発出
                parent->requestStopRendering();
#ifdef TEST
                vocaloidrv::println( "::monitor_dir; calling requestStopRendering...done" );
#endif
                // 停止要求が実行完了するまで待機
#ifdef TEST
                vocaloidrv::println( "::monitor_dir; wait until request executed..." );
#endif
                bool rendering = parent->isRendering();
                while( !gAbortMonitorRequested && rendering ){
#ifdef TEST
                    string s = "::monitor_dir; wait until request executed...rendering=";
                    s += (rendering ? "True" : "False");
                    vocaloidrv::println( s );
#endif
                    Sleep( 100 );
                    rendering = parent->isRendering();
                }
#ifdef TEST
                vocaloidrv::println( "::monitor_dir; wait until request executed...done" );
#endif
                break;
            }else{
                Sleep( 100 );
            }
        }
    }
	return 0;
}

uint64_t read_uint64_le( FILE *fp )
{
#ifdef _DEBUG
    cerr << "read_uint64_le" << endl;
#endif
    unsigned char buf[8];
    int a = 0;
    for( int k = 0; k < 8; k++ ){
        /*if( fp == stdin ){
#ifdef TEST
            vocaloidrv::println( "::read_uint64_le; fp==stdin" );
#endif
            while( !_kbhit() ){
                Sleep( 100 );
            }
        }*/
        int t = fgetc( fp );
        if( t == EOF ){
#ifdef TEST
            vocaloidrv::println( "::read_uint64_le; warning: EOF" );
#endif
            continue;
        }
        a++;
        buf[k] = (unsigned char)(0xff & t);
    }
    if( a < 8 ){
        return 0;
    }
    uint64_t ret = 0;
    int shift = 0;
    for( int i = 0; i < 8; i++ ){
        ret |= (buf[i] << shift);
        shift += 8;
    }
    return ret;
}

uint32_t read_uint32_le( FILE *fp )
{
#ifdef _DEBUG
    cerr << "read_uint32_le" << endl;
#endif
    unsigned char buf[4];
    int a = 0;
    for( int k = 0; k < 4; k++ ){
        /*if( fp == stdin ){
#ifdef TEST
            vocaloidrv::println( "::read_uint32_le; fp==stdin" );
#endif
            while( !_kbhit() ){
                Sleep( 100 );
            }
        }*/
        int t = fgetc( fp );
        if( t == EOF ){
#ifdef TEST
            vocaloidrv::println( "::read_uint32_le; warning: EOF" );
#endif
            continue;
        }
        a++;
        buf[k] = (unsigned char)(0xff & t);
    }
    if( a < 4 ){
        return 0;
    }
    return buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24);
}

void load_midi_from_file( FILE *fp, unsigned char *midi, int *clock, int *buffer_num, int *clock_num )
{
#ifdef _DEBUG
    cerr << "load_midi_from_file" << endl;
#endif
	if( NULL == fp ){
		return;
	}
    unsigned char mid[3];
	const int UNIT_LEN = 512;
    int i = 0;
    int j = 0;
    int maxcount = *clock_num;
	*clock_num = 0;
    bool consider_maxcount = maxcount > 0;
    while( consider_maxcount && i < maxcount ){
        // クロック，4 bytes
        int c = (int)read_uint32_le( fp );
        // MIDI data 3 bytes
        int a = 0;
        for( int k = 0; k < 3; k++ ){
            /*if( fp == stdin ){
#ifdef TEST
            vocaloidrv::println( "::load_midi_from_file; fp==stdin" );
#endif
                while( !_kbhit() ){
                    Sleep( 100 );
                }
            }*/
            int t = fgetc( fp );
            if( t == EOF ){
#ifdef TEST
                vocaloidrv::println( "::load_midi_from_file; warning: EOF" );
#endif
                continue;
            }
            a++;
            mid[k] = (unsigned char)(0xff & t);
        }
        //fputc( 0, stdout );
        //fflush( stdout );
        if( a < 3 ){
            break;
        }
        if( i >= (*buffer_num) ){
            (*buffer_num) += UNIT_LEN;
            clock = (int *)realloc( clock, sizeof( int ) * (*buffer_num) );
            midi = (unsigned char *)realloc( midi, sizeof( unsigned char ) * ((*buffer_num) * 3) );
        }
        clock[i] = c;
        midi[j] = mid[0];
        midi[j + 1] = mid[1];
        midi[j + 2] = mid[2];
        i++;
        j += 3;
    }
	*clock_num = i;
}

int main( int argc, char* argv[] )
{
#if defined( _DEBUG ) && defined( WIN32 )
	_CrtSetDbgFlag( _CRTDBG_ALLOC_MEM_DF | _CRTDBG_LEAK_CHECK_DF );
#endif
#ifdef TEST
    vocaloidrv::openLog( "log.txt" );
#endif
    if( argc < 3 ){
        print_help();
        return -1;
    }

    bool mode_e = false;
	string s = argv[2];
	if( s.compare( "-e" ) == 0 ){
		mode_e = true;
	}

    string dll_path = argv[1];
    if( mode_e ){
        gMonitorDir = argv[3];
    }
	string midi_file[2] = { "", "" };
	long total_samples = 0;
    int sample_rate = 44100;
	string wav = "";
	if( argc >= 5 ){
		midi_file[0] = argv[2];
		midi_file[1] = argv[3];
		total_samples = atoi( argv[4] );
	}
	if( argc >= 6 ){
		wav = argv[5];
	}
	bool use_stdout = wav.compare( "" ) == 0;
    //cout << "dll_path=" << dll_path << endl;
    vocaloidrv drv( dll_path, wav );
    if( drv.open( sample_rate, sample_rate ) ){
        cerr << "drv.open; successed" << endl;
    }else{
        cerr << "drv.open; failed" << endl;
        return 1;
    }

	if( use_stdout ){
		_setmode( _fileno( stdout ), _O_BINARY );
	}

	const int UNIT_LEN = 512;
	int clocks_length = UNIT_LEN;
	int *clocks = (int *)malloc( sizeof( int ) * clocks_length );
	unsigned char *dat = (unsigned char *)malloc( sizeof( unsigned char ) * (clocks_length * 3) );

    cerr << "mode_e=" << (mode_e ? "True" : "False") << endl;

    if( mode_e ){
        _setmode( _fileno( stdin ), _O_BINARY );
		// データの書式
		//   0 byte: コマンド種類
		//   1 byte: コマンドバイトの長さ(len)
		//   2-(2+len) byte: コマンド
		//   (2+len+1)- byte: コマンド依存のデータ

		// コマンド種類
		// 0x01  マスタートラックのmidiデータ読み込み
		//     コマンドバイトの長さ: 4 byte
		//     コマンド: 読み込むmidiデータの個数をunsigned int, little endianで指示
		//     コマンド依存データ: コマンドで指定した個数分，{4byte, 3byte}のデータが繰り返し送られてくる．4byteはクロック，3byteはMIDIデータである
		// 0x02  本体トラックのmidiデータ読み込み
		//     コマンドの内容は上と同じ
		// 0x03  レンダリング開始の指示
		//     コマンドバイトの長さ: 8 byte
		//     コマンド: レンダリングするサンプル数をuint64_tで指示
		//     コマンド依存のデータ: 無し
        // 0x04  レンダリングの停止要求
        //     コマンドバイトの長さ: 0 byte
        //     コマンド: 無し
        //     コマンド依存のデータ: 無し

        gThread = (HANDLE)_beginthreadex( NULL, 0, monitor_dir, &drv, 0, NULL );
#ifdef TEST
        const int BUFLEN = 1024;
        char buffer[BUFLEN];
#endif

		while( true ){
			int kind = fgetc( stdin );
            if( kind == EOF ){
                Sleep( 100 );
                continue;
            }
            int len = fgetc( stdin );
            while( len == EOF ){
                Sleep( 100 );
                len = fgetc( stdin );
            }
#ifdef TEST
            sprintf_s( buffer, BUFLEN, "::main; kind=%d; len=%d", kind, len );
            vocaloidrv::println( buffer );
#endif
            switch( kind ){
				case 0x01:
				case 0x02:{
                    int size = read_uint32_le( stdin );
#ifdef TEST
                    sprintf_s( buffer, BUFLEN, "::main; before; size=%d", size );
                    vocaloidrv::println( buffer );
#endif
                    load_midi_from_file( stdin, dat, clocks, &clocks_length, &size );
#ifdef TEST
                    sprintf_s( buffer, BUFLEN, "::main; after; size=%d; clocks_length=%d", size, clocks_length );
                    vocaloidrv::println( buffer );
#endif
                    drv.sendEvent( dat, clocks, size, kind - 1 );
                    break;
                }
                case 0x03:{
                    uint64_t total_samples = read_uint64_le( stdin );
#ifdef TEST
                    sprintf_s( buffer, BUFLEN, "::main; total_samples=%llu", total_samples );
                    vocaloidrv::println( buffer );
#endif
                    uint64_t ret = drv.startRendering( total_samples, sample_rate );
                    fflush( stdout );
#ifdef TEST
                    sprintf_s( buffer, BUFLEN, "::main; rendering done; ret=%llu", ret );
                    vocaloidrv::println( buffer );
#endif
                    break;
                }
			}
		}
	}else{
		// マスタートラックのMIDIデータを送信
		int num;
		for( int track = 0; track < 2; track++ ){
			FILE *fp = fopen( midi_file[track].c_str(), "rb" );
			if( NULL == fp ){
				continue;
			}
			load_midi_from_file( fp, dat, clocks, &clocks_length, &num );
			fclose( fp );
			drv.sendEvent( dat, clocks, num, track );
		}
		if( clocks ) free( clocks );
		if( dat ) free( dat );

		drv.startRendering( total_samples, sample_rate );
	}
    return 0;
}

void print_help()
{
    cout << "vocaloidrv" << endl;
    cout << "Copyright (C) 2011, kbinani" << endl;
    cout << "Usage1:" << endl;
	cout << "    vocaloidrv [vsti path] [midi master] [midi body] [total samples] {output wave}" << endl;
	cout << "Usage2:" << endl;
	cout << "    vocaloidrv [vsti path] -e" << endl;
	cout << "    Option -e means daemon mode." << endl;
    cout << "    (input midi data from stdin, output wave to stdout)" << endl;
}

VstIntPtr AudioMaster( AEffect* effect, VstInt32 opcode, VstInt32 index, VstIntPtr value, void* ptr, float opt )
{
    VstIntPtr result = 0;

    switch( opcode ){
        case audioMasterVersion:{
            result = kVstVersion;
            break;
        }
    }
    return result;
}