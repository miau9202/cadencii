/*
 * vocaloidrv.h
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
#pragma once

#define TEST

#include "../vstidrv.h"
#include <io.h>
#include <fcntl.h>
#include <stdint.h>

class vocaloidrv : public vstidrv
{
public:
    vocaloidrv( string path, string wave ) : vstidrv( path ){
        mIsRendering = false;
		mFile = NULL;
		mUseStdOut = wave.length() == 0;
		mFileName = wave;
        mBuffer = NULL;
        mBufferCount = 0;
        mProcessed = 0;
        mTotalSamples = 0;
		mIsStopRequested = false;
#ifdef _DEBUG
		cerr << "vocaloidrv#.ctor; mUseStdOut=" << (mUseStdOut ? "True" : "False") << "; mFileName=" << mFileName << endl;
#endif
	};

    ~vocaloidrv();

    bool open( int block_size, int sample_rate );

    bool sendEvent( unsigned char *midi_data, int *clock_data, int num_data, int targetTrack );

    /// <summary>
    /// 
    /// </summary>
    /// <param name="total_samples"></param>
    /// <param name="sample_rate"></param>
    /// <returns></returns>
    uint64_t startRendering( uint64_t total_samples, int sample_rate );

    bool isRendering()
    {
        return mIsRendering;
    };

    void requestStopRendering()
    {
#ifdef TEST
        println( "vocaloidrv::requestStopRendering; set mIsStopRequested true..." );
#endif
        mIsStopRequested = true;
        mIsRendering = false;
#ifdef TEST
        string s = mIsStopRequested ? "True" : "False";
        println( "vocaloidrv::requestStopRendering; set mIsStopRequested true...done; mIsStopRequested=" + s );
#endif
    };

#ifdef TEST
    static void println( string s )
    {
        WaitForSingleObject( flogMutex, INFINITE );
        fprintf( flog, "%s\n", s.c_str() );
        fflush( flog );
        ReleaseMutex( flogMutex );
    };

    static void closeLog()
    {
        WaitForSingleObject( flogMutex, INFINITE );
        fclose( flog );
        ReleaseMutex( flogMutex );
        flog = NULL;
    };

    static void openLog( string file )
    {
        flogMutex = CreateMutex( NULL, FALSE, NULL );
        WaitForSingleObject( flogMutex, INFINITE );
        flog = fopen( file.c_str(), "w" );
        ReleaseMutex( flogMutex );
    };
#endif

private:
    /// <summary>
    /// 指定したタイムコードにおける，曲頭から測った時間を調べる
    /// </summary>
    double msec_from_clock( int timeCode );

    // 波形の出力処理を行う．戻り値がtrueの場合，波形処理中に中断要求が行われたことを表す
    bool wave_incoming( double *left, double *right, int length );

    static void merge_events( vector<MidiEvent *> &x0, vector<MidiEvent *> &y0, vector<MidiEvent *> &dst );

private:
    static const int TIME_FORMAT = 480;
    static const int DEF_TEMPO = 500000;           // デフォルトのテンポ．

    vector<MidiEvent *> mEvents0;
    vector<MidiEvent *> mEvents1;
    vector<TempoInfo *> mTempoList;
    bool mIsStopRequested;
    /// <summary>
    /// StartRenderingメソッドが回っている最中にtrue
    /// </summary>
    bool mIsRendering;
	FILE *mFile;
	bool mUseStdOut;
	string mFileName;
    DWORD *mBuffer;
    int mBufferCount;
    uint64_t mProcessed;
    uint64_t mTotalSamples;
#ifdef TEST
    static FILE *flog;
    static HANDLE flogMutex;
#endif

};