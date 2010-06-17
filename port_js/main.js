function dragenter( e ){
    dropbox.setAttribute( "dragenter", true );
}

var dropbox;
var keyA, keyB, bar;
var pictPianoRoll;
var m_mouse_down_x, m_mouse_down_y, m_stdx, m_stdy;
var mouseDowned = false;
var _PX_ACCENT_HEADER = 21;

function init(){
    window.addEventListener( "dragenter", dragenter, true );
    dropbox = document.getElementById( "dropbox" );
    window.addEventListener( "dragleave", dragleave, true );
    dropbox.addEventListener( "dragover", dragover, true );
    dropbox.addEventListener( "drop", drop, true );
    updateDrawObjectList();
    pictPianoRoll = document.getElementById( "pictPianoroll" );
    pictPianoRoll.addEventListener( "mousemove", pictPianoRoll_mouseMove, true );
    pictPianoRoll.addEventListener( "mousedown", pictPianoRoll_mouseDown, true );
    pictPianoRoll.addEventListener( "mouseup", pictPianoRoll_mouseUp, true );
    window.addEventListener( "resize", formMain_resize, true );
    formMain_resize( null );
}

function pictPianoRoll_mouseDown( e ){
    m_mouse_down_x = e.pageX;
    m_mouse_down_y = e.pageY;
    m_stdx = org.kbinani.cadencii.AppManager.getStartToDrawX();
    m_stdy = org.kbinani.cadencii.AppManager.getStartToDrawY();
    mouseDowned = true;
}

function pictPianoRoll_mouseUp( e ){
    mouseDowned = false;
}

function pictPianoRoll_mouseMove( e ){
    var ctx = e.target.getContext( "2d" );
    if( mouseDowned ){
        org.kbinani.cadencii.AppManager.setStartToDrawX( m_stdx - (e.pageX - m_mouse_down_x) );
        org.kbinani.cadencii.AppManager.setStartToDrawY( m_stdy - (e.pageY - m_mouse_down_y) );
    }
    pictPianoRoll_paint( ctx );
}

function formMain_resize( e ){
    var width = window.innerWidth;
    var height = window.innerHeight;
    pictPianoRoll.setAttribute( "width", width );
    pictPianoRoll.setAttribute( "height", height );
    pictPianoRoll_paint( pictPianoRoll.getContext( "2d" ) );
}

function pictPianoRoll_paint( context ){
    var g = new org.kbinani.java.awt.Graphics( context );
    var s_brs_180_180_180 = new org.kbinani.java.awt.Color( 180,180,180);
    var s_brs_106_108_108 = new org.kbinani.java.awt.Color( 106, 108, 108 );
    var s_brs_212_212_212 = new org.kbinani.java.awt.Color( 212, 212, 212 );
    var s_brs_240_240_240 = new org.kbinani.java.awt.Color( 240, 240, 240 );
    var s_brs_153_153_153 = new org.kbinani.java.awt.Color( 153, 153, 153 );
    var s_pen_112_112_112 = new org.kbinani.java.awt.Color( 112, 112, 112 );
    var s_pen_106_108_108 = new org.kbinani.java.awt.Color( 106, 108, 108 );
    var s_pen_212_212_212 = new org.kbinani.java.awt.Color( 212, 212, 212 );
    var s_brs_125_123_124 = new org.kbinani.java.awt.Color( 125, 123, 124 );
    var s_brs_072_077_098 = new org.kbinani.java.awt.Color( 72, 77, 98 );
    var s_pen_160_160_160 = new org.kbinani.java.awt.Color( 160, 160, 160 );
    var s_pen_105_105_105 = new org.kbinani.java.awt.Color( 105, 105, 105 );
    var s_note_fill = new org.kbinani.java.awt.Color( 181, 220, 86 );
    var s_pen_125_123_124 = new org.kbinani.java.awt.Color( 125, 123, 124 );


    /*PolylineDrawer commonDrawer = new PolylineDrawer( g, 1024 );*/
    var vsq = org.kbinani.cadencii.AppManager.getVsqFile();
    var selected = org.kbinani.cadencii.AppManager.getSelected();
    var vsq_track = vsq.Track[selected];

    var width = pictPianoRoll.getAttribute( "width" );
    var height = pictPianoRoll.getAttribute( "height" );
    var window_size = new org.kbinani.java.awt.Dimension( width, height );
    //Point p = pointToClient( PortUtil.getMousePosition() );
    var mouse_position = new org.kbinani.java.awt.Point( 0, 0 );// p.x, p.y );
    var stdy = org.kbinani.cadencii.AppManager.getStartToDrawY();
    var stdx = org.kbinani.cadencii.AppManager.getStartToDrawX();
    var key_width = org.kbinani.cadencii.AppManager.keyWidth;
    var track_height = org.kbinani.cadencii.AppManager.editorConfig.PxTrackHeight;
    var half_track_height = track_height / 2;
    context.font = track_height + "px '���C���I'";
    /*
    // [screen_x] = 67 + [clock] * ScaleX - StartToDrawX + 6
    // [screen_y] = -1 * ([note] - 127) * TRACK_HEIGHT - StartToDrawY
    //
    // [screen_x] = [clock] * _scalex + 73 - StartToDrawX
    // [screen_y] = -[note] * TRACK_HEIGHT + 127 * TRACK_HEIGHT - StartToDrawY*/
    var xoffset = org.kbinani.cadencii.AppManager.keyOffset + key_width - stdx;
    var yoffset = 127 * track_height - stdy;
    //      ��
    // [screen_x] = [clock] * _scalex + xoffset
    // [screen_y] = -[note] * TRACK_HEIGHT + yoffset
    var y, dy;
    var scalex = org.kbinani.cadencii.AppManager.scaleX;
    var inv_scalex = 1.0 / scalex;

    /*if ( AppManager.getSelectedEventCount() > 0 && AppManager.inputTextBox.isVisible() ) {
        VsqEvent original = AppManager.getLastSelectedEvent().original;
        int event_x = (int)(original.Clock * scalex + xoffset);
        int event_y = -original.ID.Note * track_height + yoffset;
#if JAVA
        AppManager.inputTextBox.setLocation( pointToScreen( new Point( event_x + 4, event_y + 2 ) ) );
#else
        AppManager.inputTextBox.Left = event_x + 4;
        AppManager.inputTextBox.Top = event_y + 2;
#endif
    }*/

    var black = new org.kbinani.java.awt.Color( 212, 212, 212 ); //AppManager.editorConfig.PianorollColorVocalo2Black.getColor();
    var white = new org.kbinani.java.awt.Color( 240, 240, 240 ); //AppManager.editorConfig.PianorollColorVocalo2White.getColor();
    /*Color bar = AppManager.editorConfig.PianorollColorVocalo2Bar.getColor();
    Color beat = AppManager.editorConfig.PianorollColorVocalo2Beat.getColor();
    RendererKind renderer = RendererKind.VOCALOID2;

    EditMode edit_mode = AppManager.getEditMode();

    if ( vsq != null ) {
        renderer = VsqFileEx.getTrackRendererKind( vsq_track );
    }

    if ( renderer == RendererKind.UTAU ) {
        black = AppManager.editorConfig.PianorollColorUtauBlack.getColor();
        white = AppManager.editorConfig.PianorollColorUtauWhite.getColor();
        bar = AppManager.editorConfig.PianorollColorUtauBar.getColor();
        beat = AppManager.editorConfig.PianorollColorUtauBeat.getColor();
    } else if ( renderer == RendererKind.VOCALOID1_100 || renderer == RendererKind.VOCALOID1_101 ) {
        black = AppManager.editorConfig.PianorollColorVocalo1Black.getColor();
        white = AppManager.editorConfig.PianorollColorVocalo1White.getColor();
        bar = AppManager.editorConfig.PianorollColorVocalo1Bar.getColor();
        beat = AppManager.editorConfig.PianorollColorVocalo1Beat.getColor();
    } else if ( renderer == RendererKind.STRAIGHT_UTAU ) {
        black = AppManager.editorConfig.PianorollColorStraightBlack.getColor();
        white = AppManager.editorConfig.PianorollColorStraightWhite.getColor();
        bar = AppManager.editorConfig.PianorollColorStraightBar.getColor();
        beat = AppManager.editorConfig.PianorollColorStraightBeat.getColor();
    } else if ( renderer == RendererKind.AQUES_TONE ) {
        black = AppManager.editorConfig.PianorollColorAquesToneBlack.getColor();
        white = AppManager.editorConfig.PianorollColorAquesToneWhite.getColor();
        bar = AppManager.editorConfig.PianorollColorAquesToneBar.getColor();
        beat = AppManager.editorConfig.PianorollColorAquesToneBeat.getColor();
    }*/

    // �s�A�m���[������̃X�N���[���o�[�Ȃ�
    // �X�N���[����ʔw�i
    if ( height > 0 ) {
        g.setColor( org.kbinani.java.awt.Color.white );
        g.fillRect( 3, 0, width, height );
        g.setColor( s_brs_240_240_240 );
        g.fillRect( 3, 0, key_width, height );
    }
    // �s�A�m���[���ƃJ�[�u�G�f�B�^�̋��E
    g.setColor( s_pen_112_112_112 );
    g.drawLine( 2, height - 1, width - 1, height - 1 );

    // �s�A�m���[���{��
    if ( vsq != null ) {
        var odd = -1;
        y = 128 * track_height - stdy;
        dy = -track_height;
        for ( var i = 0; i <= 127; i++ ) {
            odd++;
            if ( odd == 12 ) {
                odd = 0;
            }
            var order = (i - odd) / 12 - 2;
            y += dy;
            if ( y > height ) {
                continue;
            } else if ( 0 > y + track_height ) {
                break;
            }
            var note_is_whitekey = org.kbinani.vsq.VsqNote.isNoteWhiteKey( i );

            // �s�A�m���[���w�i
            var b = new org.kbinani.java.awt.Color( 0, 0, 0 );
            var border;
            var paint_required = true;
            if ( order == -2 || order == -1 || (6 <= order && order <= 8) ) {
                if ( note_is_whitekey ) {
                    b = s_brs_180_180_180;
                } else {
                    b = s_brs_106_108_108;
                }
                border = s_brs_106_108_108;
            } else if ( order == 5 || order == 0 ) {
                if ( note_is_whitekey ) {
                    b = s_brs_212_212_212;
                } else {
                    b = s_brs_180_180_180;
                }
                border = new org.kbinani.java.awt.Color( 150, 152, 150 );
            } else {
                if ( note_is_whitekey ) {
                    //paint_required = false;
                    b = white;// s_brs_240_240_240;
                } else {
                    b = black;// s_brs_212_212_212;
                }
                border = new org.kbinani.java.awt.Color( 210, 205, 172 );
            }
            if ( paint_required ) {
                g.setColor( b );
                g.fillRect( key_width, y, width - key_width, track_height + 1 );
            }
            if ( odd == 0 || odd == 5 ) {
                g.setColor( border );
                g.drawLine( key_width, y + track_height, width, y + track_height );
            }

            // �v�����W���[�����̃s�A�m���[���w�i
            var premeasure_start_x = xoffset;
            if ( premeasure_start_x < key_width ) {
                premeasure_start_x = key_width;
            }
            var premeasure_end_x = 1420 * scalex + xoffset;//org.kbinani.PortUtil.castToInt( vsq.getPreMeasureClocks() * scalex + xoffset );
            if ( premeasure_end_x >= key_width ) {
                if ( note_is_whitekey ) {
                    g.setColor( s_brs_153_153_153 );
                    g.fillRect( premeasure_start_x, y,
                                premeasure_end_x - premeasure_start_x, track_height + 1 );
                } else {
                    g.setColor( s_brs_106_108_108 );
                    g.fillRect( premeasure_start_x, y,
                                premeasure_end_x - premeasure_start_x, track_height + 1 );
                }
                if ( odd == 0 || odd == 5 ) {
                    g.setColor( s_pen_106_108_108 );
                    g.drawLine( premeasure_start_x, y + track_height, premeasure_end_x, y + track_height );
                }
            }

        }
    }

    //�s�A�m���[���ƌ��Օ����̏c��
    var hilighted_note = -1;
    g.setColor( s_pen_212_212_212 );
    g.drawLine( key_width, 0, key_width, height );
    var odd2 = -1;
    y = 128 * track_height - stdy;
    dy = -track_height;
    for ( var i = 0; i <= 127; i++ ) {
        odd2++;
        if ( odd2 == 12 ) {
            odd2 = 0;
        }
        y += dy;
        if ( y > height ) {
            continue;
        } else if ( y + track_height < 0 ) {
            break;
        }

        // ���Օ���
        g.setColor( s_pen_212_212_212 );
        g.drawLine( 3, y, key_width, y );
        var hilighted = false;
        /*if ( edit_mode == EditMode.ADD_ENTRY ) {
            if ( AppManager.addingEvent.ID.Note == i ) {
                hilighted = true;
                hilighted_note = i;
            }
        } else if ( edit_mode == EditMode.EDIT_LEFT_EDGE || edit_mode == EditMode.EDIT_RIGHT_EDGE ) {
#if DEBUG
            //org.kbinani.debug.push_log( "(AppManager.LastSelectedEvent==null)=" + (AppManager.LastSelectedEvent == null) );
            //org.kbinani.debug.push_log( "(AppManager.LastSelectedEvent.Original==null)=" + (AppManager.LastSelectedEvent.Original == null) );
#endif
            if ( AppManager.getLastSelectedEvent().original.ID.Note == i ) { //TODO: ������Nullpointer exception
                hilighted = true;
                hilighted_note = i;
            }
        } else {*/
            if ( 3 <= mouse_position.x && mouse_position.x <= width - 17 &&
                0 <= mouse_position.y && mouse_position.y <= height - 1 ) {
                if ( y <= mouse_position.y && mouse_position.y < y + track_height ) {
                    hilighted = true;
                    hilighted_note = i;
                }
            }
        /*}*/
        if ( hilighted ) {
            //g.setColor( AppManager.getHilightColor() );
            g.fillRect( 35, y, key_width - 35, track_height );
        }
        if ( odd2 == 0 || hilighted ) {
            g.setColor( s_brs_072_077_098 );
            //g.setFont( AppManager.baseFont8 );
            //g.drawString( VsqNote.getNoteString( i ), 42, y + half_track_height - AppManager.baseFont8OffsetHeight + 1 );
        }
        if ( !org.kbinani.vsq.VsqNote.isNoteWhiteKey( i ) ) {
            g.setColor( s_brs_125_123_124 );
            g.fillRect( 0, y, 34, track_height );
        }
    }
    //g.setClip( null );

    //g.clipRect( key_width, 0, width - key_width, height );
    // ���߂��Ƃ̐�
    /*if ( vsq != null ) {
        int dashed_line_step = AppManager.getPositionQuantizeClock();
        for ( Iterator<VsqBarLineType> itr = vsq.getBarLineIterator( AppManager.clockFromXCoord( width ) ); itr.hasNext(); ) {
            VsqBarLineType blt = itr.next();
            int local_clock_step = 1920 / blt.getLocalDenominator();
            int x = (int)(blt.clock() * scalex + xoffset);
            g.setStroke( getStrokeDefault() );
            if ( blt.isSeparator() ) {
                //�s�A�m���[����
                g.setColor( bar );
                g.drawLine( x, 0, x, height );
            } else {
                //�s�A�m���[����
                g.setColor( beat );
                g.drawLine( x, 0, x, height );
            }
            if ( dashed_line_step > 1 && AppManager.isGridVisible() ) {
                int numDashedLine = local_clock_step / dashed_line_step;
                g.setColor( beat );
                g.setStroke( getStrokeDashed() );
                for ( int i = 1; i < numDashedLine; i++ ) {
                    int x2 = (int)((blt.clock() + i * dashed_line_step) * scalex + xoffset);
                    g.drawLine( x2, 0, x2, height );
                }
                g.setStroke( getStrokeDefault() );
            }
        }
    }
    #endregion

    // ���ݑI������Ă���̐������V�X�e���̖��O���I�[�o�[���C�\������
    if ( AppManager.drawOverSynthNameOnPianoroll ) {
        g.setFont( AppManager.baseFont50Bold );
        g.setColor( new Color( 0, 0, 0, 32 ) );
        String str = "VOCALOID2";
        if ( renderer == RendererKind.AQUES_TONE ) {
            str = "AquesTone";
        } else if ( renderer == RendererKind.VOCALOID1_100 ) {
            str = "VOCALOID1 [1.0]";
        } else if ( renderer == RendererKind.VOCALOID1_101 ) {
            str = "VOCALOID1 [1.1]";
        } else if ( renderer == RendererKind.STRAIGHT_UTAU ) {
            str = "STRAIGHT X UTAU";
        } else if ( renderer == RendererKind.UTAU ) {
            str = "UTAU";
        }
        g.drawString( str, key_width + 10, 10 + AppManager.baseFont50Height / 2 - AppManager.baseFont50OffsetHeight + 1 );
    }*/

    // �g���b�N�̃G���g����`��
    if ( org.kbinani.cadencii.AppManager.drawObjects != null ) {
        /*if ( org.kbinani.cadencii.AppManager.isOverlay() ) {
            // �܂��A�I������Ă��Ȃ��g���b�N�̊ȈՕ\�����s��
            var c = AppManager.drawObjects.size();
            for ( var i = 0; i < c; i++ ) {
                if ( i == selected - 1 ) {
                    continue;
                }
                var target_list = org.kbinani.cadencii.AppManager.drawObjects[i];
                var j_start = org.kbinani.cadencii.AppManager.drawStartIndex[i];
                var first = true;
                var shift_center = half_track_height;
                var target_list_count = target_list.size();
                for ( var j = j_start; j < target_list_count; j++ ) {
                    var dobj = target_list[j];
                    if ( dobj.type != org.kbinani.cadencii.DrawObjectType.Note ) {
                        continue;
                    }
                    var x = dobj.pxRectangle.x + key_width - stdx;
                    y = dobj.pxRectangle.y - stdy;
                    var lyric_width = dobj.pxRectangle.width;
                    if ( x + lyric_width < 0 ) {
                        continue;
                    } else if ( width < x ) {
                        break;
                    }
                    if ( org.kbinani.cadencii.AppManager.isPlaying() && first ) {
                        org.kbinani.cadencii.AppManager.drawStartIndex[i] = j;
                        first = false;
                    }
                    if ( y + track_height < 0 || y > height ) {
                        continue;
                    }
                    g.setColor( org.kbinani.cadencii.AppManager.HILIGHT[i] );
                    g.drawLine( x + 1, y + shift_center,
                                x + lyric_width - 1, y + shift_center );
                    g.setColor( s_HIDDEN[i] );
                    g.drawPolyline( new int[] { x, x + 1, x + lyric_width - 1, x + lyric_width, x + lyric_width - 1, x + 1, x },
                                    new int[] { y + shift_center, y + shift_center - 1, y + shift_center - 1, y + shift_center, y + shift_center + 1, y + shift_center + 1, y + shift_center },
                                    7 );
                }
            }
        }*/

        // �I������Ă���g���b�N�̕\�����s��
        var show_lyrics = org.kbinani.cadencii.AppManager.editorConfig.ShowLyric;
        var show_exp_line = org.kbinani.cadencii.AppManager.editorConfig.ShowExpLine;
        if ( selected >= 1 ) {
            /*Shape r = g.getClip();
            g.clipRect( key_width, 0,
                        width - key_width, height );*/
            var j_start = 0;/* org.kbinani.cadencii.AppManager.drawStartIndex[selected - 1];*/

            var first = true;
            //lock ( AppManager.drawObjects ) { //�����Ń��b�N���擾���Ȃ��ƁA�`�撆��UpdateDrawObject�̃T�C�Y��0�ɂȂ�\��������
            if ( selected - 1 < org.kbinani.cadencii.AppManager.drawObjects.length ) {
                var target_list = org.kbinani.cadencii.AppManager.drawObjects[selected - 1];
                var pit = vsq_track.MetaText.PIT;
                var pbs = vsq_track.MetaText.PBS;

                var c = target_list.length;
                for ( var j = j_start; j < c; j++ ) {
                    var dobj = target_list[j];
                    var x = dobj.pxRectangle.x + key_width - stdx;
                    y = dobj.pxRectangle.y - stdy;
                    var lyric_width = dobj.pxRectangle.width;
                    if ( x + lyric_width < 0 ) {
                        continue;
                    } else if ( width < x ) {
                        break;
                    }
                    if ( org.kbinani.cadencii.AppManager.isPlaying() && first ) {
                        org.kbinani.cadencii.AppManager.drawStartIndex[selected - 1] = j;
                        first = false;
                    }
                    if ( y + 2 * track_height < 0 || y > height ) {
                        continue;
                    }

                    if ( dobj.type == org.kbinani.cadencii.DrawObjectType.Note ) {
                        // Note
                        var id_fill;
                        if ( org.kbinani.cadencii.AppManager.getSelectedEventCount() > 0 ) {
                            var found = org.kbinani.cadencii.AppManager.isSelectedEventContains( selected, dobj.internalID );
                            if ( found ) {
                                id_fill = Aorg.kbinani.cadencii.AppManager.getHilightColor();
                            } else {
                                id_fill = s_note_fill;
                            }
                        } else {
                            id_fill = s_note_fill;
                        }
                        g.setColor( id_fill );
                        g.fillRect( x, y + 1, lyric_width, track_height - 1 );
                        /*var lyric_font = dobj.symbolProtected ? AppManager.baseFont10Bold : AppManager.baseFont10;*/
                        if ( dobj.overlappe ) {
                            g.setColor( s_pen_125_123_124 );
                            g.drawRect( x, y + 1, lyric_width, track_height - 1 );
                            if ( show_lyrics ) {
                                //g.setFont( lyric_font );
                                g.setColor( s_brs_147_147_147 );
                                g.drawString( dobj.text, x + 1, y + track_height + 1 );
                            }
                        } else {
                            g.setColor( s_pen_125_123_124 );
                            g.drawRect( x, y + 1, lyric_width, track_height - 1 );
                            if ( show_lyrics ) {
                                //g.setFont( lyric_font );
                                g.setColor( org.kbinani.java.awt.Color.black );
                                g.drawString( dobj.text, x + 1, y + track_height + 1 );
                            }
                            if ( show_exp_line && lyric_width > 21 ) {
                                // �\���
                                /*DrawAccentLine( g, new Point( x, y + track_height + 1 ), dobj.accent );
                                int vibrato_start = x + lyric_width;
                                int vibrato_end = x;
                                if ( dobj.pxVibratoDelay <= lyric_width ) {
                                    int vibrato_delay = dobj.pxVibratoDelay;
                                    int vibrato_width = dobj.pxRectangle.width - vibrato_delay;
                                    vibrato_start = x + vibrato_delay;
                                    vibrato_end = x + vibrato_delay + vibrato_width;
                                    if ( vibrato_start - x < 21 ) {
                                        vibrato_start = x + 21;
                                    }
                                }
                                g.setColor( s_pen_051_051_000 );
                                g.drawLine( x + 21, y + track_height + 7,
                                            vibrato_start, y + track_height + 7 );
                                if ( dobj.pxVibratoDelay <= lyric_width ) {
                                    int next_draw = vibrato_start;
                                    if ( vibrato_start < vibrato_end ) {
                                        drawVibratoLine( g,
                                                         new Point( vibrato_start, y + track_height + 1 ),
                                                         vibrato_end - vibrato_start );
                                    }
                                }*/
                            }
                            // �r�u���[�g�������
                            if ( org.kbinani.cadencii.AppManager.editorConfig.ViewAtcualPitch ) {
                                /*if ( dobj.vibRate != null ) {
                                    int vibrato_delay = dobj.pxVibratoDelay;
                                    int vibrato_width = dobj.pxRectangle.width - vibrato_delay;
                                    int vibrato_start = x + vibrato_delay;
                                    int vibrato_end = x + vibrato_delay + vibrato_width;
                                    int cl_sx = AppManager.clockFromXCoord( vibrato_start );
                                    int cl_ex = AppManager.clockFromXCoord( vibrato_end );
                                    drawVibratoPitchbend( g,
                                                          dobj.vibRate,
                                                          dobj.vibStartRate,
                                                          dobj.vibDepth,
                                                          dobj.vibStartDepth,
                                                          dobj.note,
                                                          vibrato_start,
                                                          vibrato_width );
                                }*/
                            }

                            // �s�b�`�x���h
                            /*if ( AppManager.editorConfig.ViewAtcualPitch || AppManager.curveOnPianoroll ) {
                                int cl_start = dobj.clock;
                                int cl_end = cl_start + dobj.length;

                                commonDrawer.clear();
                                g.setColor( Color.blue );
                                g.setStroke( getStroke2px() );
                                // ���̉����͈̔͂ɂ��Ă̂݁C�s�b�`�x���h�Ȑ���`��
                                int lasty = int.MinValue;
                                ByRef<Integer> indx_pit = new ByRef<Integer>( 0 );
                                ByRef<Integer> indx_pbs = new ByRef<Integer>( 0 );
                                for ( int cl = cl_start; cl < cl_end; cl++ ) {
                                    int vpit = pit.getValue( cl, indx_pit );
                                    int vpbs = pbs.getValue( cl, indx_pbs );

                                    float delta = vpit * (float)vpbs / 8192.0f;
                                    float note = dobj.note + delta;

                                    int py = AppManager.yCoordFromNote( note ) + half_track_height;
                                    if ( cl + 1 == cl_end ) {
                                        int px = AppManager.xCoordFromClocks( cl + 1 );
                                        commonDrawer.append( px, lasty );
                                    } else {
                                        if ( py == lasty ) {
                                            continue;
                                        }
                                        int px = AppManager.xCoordFromClocks( cl );
                                        if ( cl != cl_start ) {
                                            commonDrawer.append( px, lasty );
                                        }
                                        commonDrawer.append( px, py );
                                        lasty = py;
                                    }
                                }
                                commonDrawer.flush();
#if !JAVA
                                g.nativeGraphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.Default;
#endif
                                g.setStroke( getStrokeDefault() );
                            }*/
                        }
                    } else if ( dobj.type == org.kbinani.cadencii.DrawObjectType.Dynaff ) {
                        // Dynaff
                        var fill = s_dynaff_fill;
                        if ( org.kbinani.cadencii.AppManager.isSelectedEventContains( selected, dobj.internalID ) ) {
                            fill = s_dynaff_fill_highlight;
                        }
                        g.setColor( fill );
                        g.fillRect( x, y, 40, track_height );
                        g.setColor( s_pen_125_123_124 );
                        g.drawRect( x, y, 40, track_height );
                        g.setColor( Color.black );
                        g.setFont( AppManager.baseFont10 );
                        if ( dobj.overlappe ) {
                            g.setColor( s_brs_147_147_147 );
                        }
                        var str = dobj.text;
                        /*g.drawString( str, x + 1, y + half_track_height - AppManager.baseFont10OffsetHeight + 1 );*/
                    } else {
                        // Crescend and Descrescend
                        var xend = x + lyric_width;
                        var fill = s_dynaff_fill;
                        if ( AppManager.isSelectedEventContains( selected, dobj.internalID ) ) {
                            fill = s_dynaff_fill_highlight;
                        }
                        g.setColor( fill );
                        g.fillRect( x, y, xend - x, track_height );
                        g.setColor( s_pen_125_123_124 );
                        g.drawRect( x, y, xend - x, track_height );
                        if ( dobj.overlappe ) {
                            g.setColor( s_brs_147_147_147 );
                        } else {
                            g.setColor( Color.black );
                        }
                        g.setFont( AppManager.baseFont10 );
                        var str = dobj.text;
                        /*g.drawString( str, x + 1, y + track_height + half_track_height - AppManager.baseFont10OffsetHeight + 1 );*/
                        if ( dobj.type == DrawObjectType.Crescend ) {
                            g.drawLine( xend - 2, y + 4, x + 3, y + half_track_height );
                            g.drawLine( x + 3, y + half_track_height, xend - 2, y + track_height - 3 );
                        } else if ( dobj.type == DrawObjectType.Decrescend ) {
                            g.drawLine( x + 3, y + 4, xend - 2, y + half_track_height );
                            g.drawLine( xend - 2, y + half_track_height, x + 3, y + track_height - 3 );
                        }
                    }
                }
            }
            /*g.setClip( r );*/
        }

        // �ҏW���̃G���g����\��
        /*if ( edit_mode == EditMode.ADD_ENTRY ||
             edit_mode == EditMode.ADD_FIXED_LENGTH_ENTRY ||
             edit_mode == EditMode.REALTIME ||
             edit_mode == EditMode.DRAG_DROP ) {
            if ( AppManager.addingEvent != null ) {
                int x = (int)(AppManager.addingEvent.Clock * scalex + xoffset);
                y = -AppManager.addingEvent.ID.Note * track_height + yoffset + 1;
                int length = (int)(AppManager.addingEvent.ID.getLength() * scalex);
                if ( AppManager.addingEvent.ID.type == VsqIDType.Aicon ) {
                    if ( AppManager.addingEvent.ID.IconDynamicsHandle.isDynaffType() ) {
                        length = AppManager.DYNAFF_ITEM_WIDTH;
                    }
                }
                if ( AppManager.addingEvent.ID.getLength() <= 0 ) {
                    g.setColor( new Color( 171, 171, 171 ) );
                    g.drawRect( x, y, 10, track_height - 1 );
                } else {
                    g.setColor( s_pen_a136_000_000_000 );
                    g.drawRect( x, y, length, track_height - 1 );
                }
            }
        } else if ( edit_mode == EditMode.EDIT_VIBRATO_DELAY ) {
            int x = (int)(AppManager.addingEvent.Clock * scalex + xoffset);
            y = -AppManager.addingEvent.ID.Note * track_height + yoffset + 1;
            int length = (int)(AppManager.addingEvent.ID.getLength() * scalex);
            g.setColor( s_pen_a136_000_000_000 );
            g.drawRect( x, y, length, track_height - 1 );
        } else if ( (edit_mode == EditMode.MOVE_ENTRY ||
                     edit_mode == EditMode.MOVE_ENTRY_WHOLE ||
                     edit_mode == EditMode.EDIT_LEFT_EDGE ||
                     edit_mode == EditMode.EDIT_RIGHT_EDGE) && AppManager.getSelectedEventCount() > 0 ) {
            for ( Iterator<SelectedEventEntry> itr = AppManager.getSelectedEventIterator(); itr.hasNext(); ) {
                SelectedEventEntry ev = itr.next();
                int x = (int)(ev.editing.Clock * scalex + xoffset);
                y = -ev.editing.ID.Note * track_height + yoffset + 1;
                if ( ev.editing.ID.type == VsqIDType.Aicon ) {
                    if ( ev.editing.ID.IconDynamicsHandle == null ) {
                        continue;
                    }
                    int length = 0;
                    if ( ev.editing.ID.IconDynamicsHandle.isDynaffType() ) {
                        length = AppManager.DYNAFF_ITEM_WIDTH;
                    } else {
                        length = (int)(ev.editing.ID.getLength() * scalex);
                    }
                    g.setColor( s_pen_a136_000_000_000 );
                    g.drawRect( x, y, length, track_height - 1 );
                } else {
                    if ( ev.editing.ID.getLength() == 0 ) {
                        g.setColor( new Color( 171, 171, 171 ) );
                        g.setStroke( s_pen_dashed_171_171_171 );
                        g.drawRect( x, y, 10, track_height - 1 );
                        g.setStroke( getStrokeDefault() );
                    } else {
                        int length = (int)(ev.editing.ID.getLength() * scalex);
                        g.setColor( s_pen_a136_000_000_000 );
                        g.drawRect( x, y, length, track_height - 1 );
                    }
                }
            }

            if ( edit_mode == EditMode.MOVE_ENTRY_WHOLE ) {
                int clock_start = AppManager.wholeSelectedInterval.getStart();
                int clock_end = AppManager.wholeSelectedInterval.getEnd();
                int x_start = AppManager.xCoordFromClocks( AppManager.wholeSelectedIntervalStartForMoving );
                int x_end = AppManager.xCoordFromClocks( AppManager.wholeSelectedIntervalStartForMoving + (clock_end - clock_start) );
                g.setColor( s_brs_a098_000_000_000 );
                g.drawLine( x_start, 0, x_start, height );
                g.drawLine( x_end, 0, x_end, height );
            }
        }*/
    }
    /*g.setClip( null );*/

    // �����ҏW���̕⏕��
    /*if ( edit_mode == EditMode.ADD_ENTRY ) {
        #region EditMode.AddEntry
        int x = (int)(AppManager.addingEvent.Clock * scalex + xoffset);
        y = -AppManager.addingEvent.ID.Note * track_height + yoffset + 1;
        int length;
        if ( AppManager.addingEvent.ID.getLength() == 0 ) {
            length = 10;
        } else {
            length = (int)(AppManager.addingEvent.ID.getLength() * scalex);
        }
        x += length;
        g.setColor( s_pen_LU );
        g.drawLine( x, 0, x, y - 1 );
        g.drawLine( x, y + track_height, x, height );
        g.setColor( s_pen_RD );
        g.drawLine( x + 1, 0, x + 1, y - 1 );
        g.drawLine( x + 1, y + track_height, x + 1, height );
        #endregion
    } else if ( edit_mode == EditMode.MOVE_ENTRY || edit_mode == EditMode.MOVE_ENTRY_WAIT_MOVE ) {
        #region EditMode.MoveEntry || EditMode.MoveEntryWaitMove
        if ( AppManager.getSelectedEventCount() > 0 ) {
            VsqEvent last = AppManager.getLastSelectedEvent().editing;
            int x = (int)(last.Clock * scalex + xoffset);
            y = -last.ID.Note * track_height + yoffset + 1;
            int length = (int)(last.ID.getLength() * scalex);

            if ( last.ID.type == VsqIDType.Aicon ) {
                if ( last.ID.IconDynamicsHandle.isDynaffType() ) {
                    length = AppManager.DYNAFF_ITEM_WIDTH;
                }
            }

            // �c��
            g.setColor( s_pen_LU );
            g.drawLine( x, 0, x, y - 1 );
            g.drawLine( x, y + track_height, x, height );
            // ����
            g.drawLine( key_width, y + half_track_height - 2,
                        x - 1, y + half_track_height - 2 );
            g.drawLine( x + length + 1, y + half_track_height - 2,
                        width, y + half_track_height - 2 );
            // �c��
            g.setColor( s_pen_RD );
            g.drawLine( x + 1, 0, x + 1, y - 1 );
            g.drawLine( x + 1, y + track_height,
                        x + 1, height );
            // ����
            g.drawLine( key_width, y + half_track_height - 1,
                        x - 1, y + half_track_height - 1 );
            g.drawLine( x + length + 1, y + half_track_height - 1,
                        width, y + half_track_height - 1 );
        }
        #endregion
    } else if ( edit_mode == EditMode.ADD_FIXED_LENGTH_ENTRY || edit_mode == EditMode.DRAG_DROP ) {
        #region ADD_FIXED_LENGTH_ENTRY | DRAG_DROP
        int x = (int)(AppManager.addingEvent.Clock * scalex + xoffset);
        y = -AppManager.addingEvent.ID.Note * track_height + yoffset + 1;
        int length = (int)(AppManager.addingEvent.ID.getLength() * scalex);

        if ( AppManager.addingEvent.ID.type == VsqIDType.Aicon ) {
            if ( AppManager.addingEvent.ID.IconDynamicsHandle.isDynaffType() ) {
                length = AppManager.DYNAFF_ITEM_WIDTH;
            }
        }

        // �c��
        g.setColor( s_pen_LU );
        g.drawLine( x, 0, x, y - 1 );
        g.drawLine( x, y + track_height, x, height );
        // ����
        g.drawLine( key_width, y + half_track_height - 2,
                    x - 1, y + half_track_height - 2 );
        g.drawLine( x + length + 1, y + half_track_height - 2,
                    width, y + half_track_height - 2 );
        // �c��
        g.setColor( s_pen_RD );
        g.drawLine( x + 1, 0, x + 1, y - 1 );
        g.drawLine( x + 1, y + track_height, x + 1, height );
        // ����
        g.drawLine( key_width, y + half_track_height - 1,
                    x - 1, y + half_track_height - 1 );
        g.drawLine( x + length + 1, y + half_track_height - 1,
                    width, y + half_track_height - 1 );
        #endregion
    } else if ( edit_mode == EditMode.EDIT_LEFT_EDGE ) {
        #region EditMode.EditLeftEdge
        VsqEvent last = AppManager.getLastSelectedEvent().editing;
        int x = (int)(last.Clock * scalex + xoffset);
        y = -last.ID.Note * track_height + yoffset + 1;
        g.setColor( s_pen_LU );
        g.drawLine( x, 0, x, y - 1 );
        g.drawLine( x, y + track_height, x, height );
        g.setColor( s_pen_RD );
        g.drawLine( x + 1, 0, x + 1, y - 1 );
        g.drawLine( x + 1, y + track_height, x + 1, height );
        #endregion
    } else if ( edit_mode == EditMode.EDIT_RIGHT_EDGE ) {
        #region EditMode.EditRightEdge
        VsqEvent last = AppManager.getLastSelectedEvent().editing;
        int x = (int)(last.Clock * scalex + xoffset);
        y = -last.ID.Note * track_height + yoffset + 1;
        int length = (int)(last.ID.getLength() * scalex);
        x += length;
        g.setColor( s_pen_LU );
        g.drawLine( x, 0, x, y - 1 );
        g.drawLine( x, y + track_height, x, height );
        g.setColor( s_pen_RD );
        g.drawLine( x + 1, 0, x + 1, y - 1 );
        g.drawLine( x + 1, y + track_height, x + 1, height );
        #endregion
    } else if ( edit_mode == EditMode.EDIT_VIBRATO_DELAY ) {
        #region EditVibratoDelay
        int x = (int)(AppManager.addingEvent.Clock * scalex + xoffset);
        y = -AppManager.addingEvent.ID.Note * track_height + yoffset + 1;
        g.setColor( s_pen_LU );
        g.drawLine( x, 0, x, y - 1 );
        g.drawLine( x, y + track_height, x, height );
        g.setColor( s_pen_RD );
        g.drawLine( x + 1, 0, x + 1, y - 1 );
        g.drawLine( x + 1, y + track_height, x + 1, height );
        double max_length = AppManager.addingEventLength - _PX_ACCENT_HEADER / scalex;
        double drate = AppManager.addingEvent.ID.getLength() / max_length;
        if ( drate > 0.99 ) {
            drate = 1.00;
        }
        int rate = (int)(drate * 100.0);
        String percent = rate + "%";
        Dimension size = Util.measureString( percent, s_F9PT );
        int delay_x = (int)((AppManager.addingEvent.Clock + AppManager.addingEvent.ID.getLength() - AppManager.addingEventLength + AppManager.addingEvent.ID.VibratoDelay) * scalex + xoffset);
        Rectangle pxArea = new Rectangle( delay_x,
                                          (int)(y + track_height * 2.5),
                                          (int)(size.width * 1.2),
                                          (int)(size.height * 1.2) );
        g.setColor( s_brs_192_192_192 );
        g.fillRect( pxArea.x, pxArea.y, pxArea.width, pxArea.height );
        g.setColor( Color.black );
        g.drawRect( pxArea.x, pxArea.y, pxArea.width, pxArea.height );
        // StringFormat sf = new StringFormat();
        //sf.Alignment = StringAlignment.Center;
        //sf.LineAlignment = StringAlignment.Center;
        g.setFont( s_F9PT );
        g.drawString( percent, pxArea.x, pxArea.y );// , sf );
        #endregion
    }*/

    // �}�E�X�ʒu�ł̉��K��
    /*if ( hilighted_note >= 0 ) {
        int align = 1;
        int valign = 0;
        g.setColor( Color.black );
        PortUtil.drawStringEx( g,
                               VsqNote.getNoteString( hilighted_note ),
                               AppManager.baseFont10Bold,
                               new Rectangle( mouse_position.x - 110, mouse_position.y - 50, 100, 100 ),
                               align,
                               valign );
    }*/

    // �O�g
    // ��(�O��)
    g.setColor( s_pen_160_160_160 );
    g.drawLine( 0, 0, 0, height );
    // ��(����)
    g.setColor( s_pen_105_105_105 );
    g.drawLine( 1, 0, 1, height );

    // pictPianoRoll_Paint���
    /*if ( AppManager.isWholeSelectedIntervalEnabled() ) {
        int start = (int)(AppManager.wholeSelectedInterval.getStart() * scalex) + xoffset;
        if ( start < key_width ) {
            start = key_width;
        }
        int end = (int)(AppManager.wholeSelectedInterval.getEnd() * scalex) + xoffset;
        if ( start < end ) {
            g.setColor( new Color( 0, 0, 0, 98 ) );
            g.fillRect( start, 0, end - start, getHeight() );
        }
    } else if ( AppManager.isPointerDowned ) {
        Point pmouse = pointToClient( PortUtil.getMousePosition() );
        Point mouse = new Point( pmouse.x, pmouse.y );
        int tx, ty, twidth, theight;
        int lx = AppManager.mouseDownLocation.x - stdx;
        if ( lx < mouse.x ) {
            tx = lx;
            twidth = mouse.x - lx;
        } else {
            tx = mouse.x;
            twidth = lx - mouse.x;
        }
        int ly = AppManager.mouseDownLocation.y - stdy;
        if ( ly < mouse.y ) {
            ty = ly;
            theight = mouse.y - ly;
        } else {
            ty = mouse.y;
            theight = ly - mouse.y;
        }
        if ( tx < key_width ) {
            int txold = tx;
            tx = key_width;
            twidth -= (tx - txold);
        }
        Rectangle rc = new Rectangle( tx, ty, twidth, theight );
        Color pen = new Color( 0, 0, 0, 200 );
        g.setColor( new Color( 0, 0, 0, 100 ) );
        g.fillRect( rc.x, rc.y, rc.width, rc.height );
#if !JAVA
        g.nativeGraphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
#endif
        g.setStroke( new BasicStroke( 1.0f, 0, BasicStroke.JOIN_ROUND ) );
        g.setColor( pen );
        g.drawRect( rc.x, rc.y, rc.width, rc.height );
    }*/

    // �R���g���[���J�[�u�̃I�[�o�[���C�\��
    /*if ( AppManager.curveOnPianoroll ) {
        g.setClip( null ); 
       
        Area fillarea = new Area( new Rectangle( key_width, 0, width - key_width, height ) ); // �h��Ԃ��̈�D�Ō�ɏ�������
        //g.setColor( new Color( 255, 255, 255, 64 ) );
        //g.fillRect( key_width, 0, width - key_width, height );

        VsqBPList pbs = vsq_track.MetaText.PBS;
        if ( pbs == null ) {
            pbs = new VsqBPList( CurveType.PBS.getName(), 
                                 CurveType.PBS.getDefault(), 
                                 CurveType.PBS.getMinimum(), 
                                 CurveType.PBS.getMaximum() );
        }

        Color pitline = PortUtil.MidnightBlue;
        g.setStroke( getStroke2px() );
        lock ( AppManager.drawObjects ) {
            Vector<DrawObject> list = AppManager.drawObjects.get( selected - 1 );
            int j_start = AppManager.drawStartIndex[selected - 1];
            int c = list.size();
            int last_x = key_width;
            
            int pbs_count = pbs.size();
            double a = 1.0 / 8192.0;

            //ByRef<Integer> pit_index = new ByRef<Integer>( 0 );
            //ByRef<Integer> pbs_index_for_pit = new ByRef<Integer>( 0 );

            for ( int j = j_start; j < c; j++ ) {
                DrawObject dobj = list.get( j );
                int clock = dobj.clock;
                int x_at_clock = (int)(clock * scalex + xoffset);
                last_x = x_at_clock;

                // �����̋�Ԓ��ɁCPBS�����邩������Ȃ��̂�PBS�̃f�[�^�_��T���Ȃ���h��Ԃ�
                ByRef<Integer> pbs_index = new ByRef<Integer>( 0 );
                int last_pbs_value = pbs.getValue( clock, pbs_index );

                if ( pbs_count <= 0 ) {
                    // �f�[�^�_�������ꍇ
                    double delta_note = 8192.0 * last_pbs_value * a;
                    int y_top = (int)(-(dobj.note + delta_note - 0.5) * track_height + yoffset);
                    int y_bottom = (int)(-(dobj.note - delta_note - 0.5) * track_height + yoffset);

                    if ( last_x < key_width ) {
                        last_x = key_width;
                    }
                    int x = (int)((clock + dobj.length) * scalex + xoffset);
                    fillarea.subtract( new Area( new Rectangle( last_x, y_top, x - last_x, y_bottom - y_top ) ) );
                    last_x = x;
                } else {
                    // �f�[�^�_������ꍇ
                    for ( ; pbs_index.value < pbs_count; pbs_index.value++ ) {
                        int pbs_clock;
                        int pbs_value;
                        if ( 0 <= pbs_index.value + 1 && pbs_index.value + 1 < pbs_count ) {
                            pbs_clock = pbs.getKeyClock( pbs_index.value + 1 );
                            if ( pbs_clock > clock + dobj.length ) {
                                pbs_clock = clock + dobj.length;
                            }
                            pbs_value = pbs.getElement( pbs_index.value + 1 );
                        } else {
                            pbs_clock = clock + dobj.length;
                            pbs_value = last_pbs_value;
                        }

                        double delta_note = 8192.0 * last_pbs_value * a;

                        int y_top = (int)(-(dobj.note + delta_note - 0.5) * track_height + yoffset);
                        int y_bottom = (int)(-(dobj.note - delta_note - 0.5) * track_height + yoffset);
                        int x = (int)(pbs_clock * scalex + xoffset);
                        if ( x < key_width ) {
                            x = key_width;
                            last_x = x;
                            last_pbs_value = pbs_value;
                            continue;
                        }
                        if ( last_x < key_width ) {
                            last_x = key_width;
                        }

                        fillarea.subtract( new Area( new Rectangle( last_x, y_top, x - last_x, y_bottom - y_top ) ) );

                        last_x = x;
                        last_pbs_value = pbs_value;
                    }
                }
            }
        }

        Color fill = new Color( 0, 0, 0, 128 );
        g.setColor( fill );
        g.fill( fillarea );

        if ( mouseTracer.size() > 1 ) {
            commonDrawer.clear();
            g.setColor( Color.red );
            g.setStroke( getStroke2px() );
            for ( Iterator<Point> itr = mouseTracer.iterator(); itr.hasNext(); ) {
                Point pt = itr.next();
                commonDrawer.append( pt.x - stdx, pt.y - stdy );
            }
            commonDrawer.flush();
        }
    }*/

    // �}�[�J�[
    var marker_x = org.kbinani.PortUtil.castToInt( 
        org.kbinani.cadencii.AppManager.getCurrentClock() * scalex
      + org.kbinani.cadencii.AppManager.keyOffset + key_width - stdx );
    if ( key_width <= marker_x && marker_x <= width ) {
        g.setColor( org.kbinani.java.awt.Color.white );
        /*g.setStroke( getStroke2px() );*/
        g.drawLine( marker_x, 0, marker_x, height );
        /*g.setStroke( getStrokeDefault() );*/
    }
}

/// <summary>
/// �`�悷�ׂ��I�u�W�F�N�g�̃��X�g�CAppManager.drawObjects���X�V���܂�
/// </summary>
function updateDrawObjectList() {
    if ( org.kbinani.cadencii.AppManager.drawObjects == null ) {
        org.kbinani.cadencii.AppManager.drawObjects = new Array();
    }
    if ( org.kbinani.cadencii.AppManager.getVsqFile() == null ) {
        return;
    }
    for ( var i = 0; i < org.kbinani.cadencii.AppManager.drawStartIndex.length; i++ ) {
        org.kbinani.cadencii.AppManager.drawStartIndex[i] = 0;
    }
    if ( org.kbinani.cadencii.AppManager.drawObjects != null ) {
        for ( var itr = new org.kbinani.ArrayIterator( org.kbinani.cadencii.AppManager.drawObjects ); itr.hasNext(); ) {
            var list = itr.next();
            list.splice( 0, list.length );
        }
        org.kbinani.cadencii.AppManager.drawObjects.splice( org.kbinani.cadencii.AppManager.drawObjects.length );
    }

    var xoffset = 6;
    var yoffset = 127 * org.kbinani.cadencii.AppManager.editorConfig.PxTrackHeight;
    var scalex = org.kbinani.cadencii.AppManager.scaleX;
    var SMALL_FONT = null;
    /*SMALL_FONT = new Font( org.kbinani.cadencii.AppManager.editorConfig.ScreenFontName, java.awt.Font.PLAIN, org.kbinani.cadencii.AppManager.FONT_SIZE8 );*/
    var track_height = org.kbinani.cadencii.AppManager.editorConfig.PxTrackHeight;
    var vsq = org.kbinani.cadencii.AppManager.getVsqFile();
    var track_count = vsq.Track.length;
    for ( var track = 1; track < track_count; track++ ) {
        var vsq_track = vsq.Track[track];
        org.kbinani.cadencii.AppManager.drawObjects[track - 1] = new Array();

        // �����C�x���g
        for ( var itr = vsq_track.getEventIterator(); itr.hasNext(); ) {
            var ev = itr.next();
            var timesig = ev.Clock;
            if ( ev.ID.LyricHandle != null ) {
                var length = ev.ID.getLength();
                var note = ev.ID.Note;
                var x = org.kbinani.PortUtil.castToInt( timesig * scalex + xoffset );
                var y = -note * track_height + yoffset;
                var lyric_width = org.kbinani.PortUtil.castToInt( length * scalex );
                var lyric_jp = ev.ID.LyricHandle.L0.Phrase;
                var lyric_en = ev.ID.LyricHandle.L0.getPhoneticSymbol();
//alert( "updateDrawObjectList; lyric_jp=" + lyric_jp + "; lyric_en=" + lyric_en );
                var title = lyric_jp + " [" + lyric_en + "]";/*Utility.trimString( lyric_jp + " [" + lyric_en + "]", SMALL_FONT, lyric_width );*/
                var accent = ev.ID.DEMaccent;
                var vibrato_start = x + lyric_width;
                var vibrato_end = x;
                var vibrato_delay = lyric_width * 2;
                if ( ev.ID.VibratoHandle != null ) {
                    var rate = ev.ID.VibratoDelay / length;
                    vibrato_delay = _PX_ACCENT_HEADER + org.kbinani.PortUtil.castToInt( (lyric_width - _PX_ACCENT_HEADER) * rate );
                }
                var rate_bp = null;
                var depth_bp = null;
                var rate_start = 0;
                var depth_start = 0;
                if ( ev.ID.VibratoHandle != null ) {
                    rate_bp = ev.ID.VibratoHandle.getRateBP();
                    depth_bp = ev.ID.VibratoHandle.getDepthBP();
                    rate_start = ev.ID.VibratoHandle.getStartRate();
                    depth_start = ev.ID.VibratoHandle.getStartDepth();
                }
                org.kbinani.cadencii.AppManager.drawObjects[track - 1].push( new org.kbinani.cadencii.DrawObject( 
                                         org.kbinani.cadencii.DrawObjectType.Note,
                                         new org.kbinani.java.awt.Rectangle( x, y, lyric_width, track_height ),
                                         title,
                                         accent,
                                         ev.InternalID,
                                         vibrato_delay,
                                         false,
                                         ev.ID.LyricHandle.L0.PhoneticSymbolProtected,
                                         rate_bp,
                                         depth_bp,
                                         rate_start,
                                         depth_start,
                                         ev.ID.Note,
                                         null/*ev.UstEvent.Envelope*/,
                                         length,
                                         timesig,
                                         true ) );
            }
        }

        // Dynaff, Crescend�C�x���g
        for ( var itr = vsq_track.getDynamicsEventIterator(); itr.hasNext(); ) {
            var item = itr.next();
            var handle = item.ID.IconDynamicsHandle;
            if ( handle == null ) {
                continue;
            }
            var clock = item.Clock;
            var length = item.ID.getLength();
            if ( length <= 0 ) {
                length = 1;
            }
            var raw_width = (int)(length * scalex);
            var type = org.kbinani.cadencii.DrawObjectType.Note;
            var width = 0;
            var str = "";
            if ( handle.isDynaffType() ) {
                // ����L��
                type = org.kbinani.cadencii.DrawObjectType.Dynaff;
                width = org.kbinani.cadencii.AppManager.DYNAFF_ITEM_WIDTH;
                var startDyn = handle.getStartDyn();
                if ( startDyn == 120 ) {
                    str = "fff";
                } else if ( startDyn == 104 ) {
                    str = "ff";
                } else if ( startDyn == 88 ) {
                    str = "f";
                } else if ( startDyn == 72 ) {
                    str = "mf";
                } else if ( startDyn == 56 ) {
                    str = "mp";
                } else if ( startDyn == 40 ) {
                    str = "p";
                } else if ( startDyn == 24 ) {
                    str = "pp";
                } else if ( startDyn == 8 ) {
                    str = "ppp";
                } else {
                    str = "?";
                }
            } else if ( handle.isCrescendType() ) {
                // �N���b�V�F���h
                type = org.kbinani.cadencii.DrawObjectType.Crescend;
                width = raw_width;
                str = handle.IDS;
            } else if ( handle.isDecrescendType() ) {
                // �f�N���b�V�F���h
                type = org.kbinani.cadencii.DrawObjectType.Decrescend;
                width = raw_width;
                str = handle.IDS;
            }
            if ( type == DrawObjectType.Note ) {
                continue;
            }
            var note = item.ID.Note;
            var x = org.kbinani.PortUtil.castToInt( clock * scalex + xoffset );
            var y = -note * org.kbinani.cadencii.AppManager.editorConfig.PxTrackHeight + yoffset;
            org.kbinani.cadencii.AppManager.drawObjects[track - 1].push( new org.kbinani.cadencii.DrawObject( type,
                                     new org.kbinani.java.awt.Rectangle( x, y, width, track_height ),
                                     str,
                                     0,
                                     item.InternalID,
                                     0,
                                     false,
                                     false,
                                     null,
                                     null,
                                     0,
                                     0,
                                     item.ID.Note,
                                     null,
                                     length,
                                     clock,
                                     true ) );
        }

        // �d�����������邩�ǂ����𔻒�
        var count = org.kbinani.cadencii.AppManager.drawObjects[track - 1].length;
        for ( var i = 0; i < count - 1; i++ ) {
            var itemi = org.kbinani.cadencii.AppManager.drawObjects[track - 1][i];
            var parent_type = itemi.type;
            /*if ( itemi.type != DrawObjectType.Note ) {
                continue;
            }*/
            var overwrapped = false;
            var istart = itemi.clock;
            var iend = istart + itemi.length;
            if ( itemi.overlappe ) {
                continue;
            }
            for ( var j = i + 1; j < count; j++ ) {
                var itemj = org.kbinani.cadencii.AppManager.drawObjects[track - 1][j];
                if ( (itemj.type == org.kbinani.cadencii.DrawObjectType.Note && parent_type != org.kbinani.cadencii.DrawObjectType.Note) ||
                     (itemj.type != org.kbinani.cadencii.DrawObjectType.Note && parent_type == org.kbinani.cadencii.DrawObjectType.Note) ) {
                    continue;
                }
                var jstart = itemj.clock;
                var jend = jstart + itemj.length;
                if ( jstart <= istart ) {
                    if ( istart < jend ) {
                        overwrapped = true;
                        itemj.overlappe = true;
                        // break�ł��Ȃ��D2�ȏ�̏d�������o����K�v������̂ŁD
                    }
                }
                if ( istart <= jstart ) {
                    if ( jstart < iend ) {
                        overwrapped = true;
                        itemj.overlappe = true;
                    }
                }
            }
            if ( overwrapped ) {
                itemi.overlappe = true;
            }
        }
        org.kbinani.cadencii.AppManager.drawObjects.sort( org.kbinani.cadencii.DrawObject.compare );
        //org.kbinani.cadencii.AppManager.drawObjects.push( tmp );
    }
}

function get_style_attribute( style, attr ){
    attr = attr + ":";
    var indx = style.indexOf( attr );
    var indx2 = style.indexOf( ";", indx + attr.length );
    return oldvalue = style.substring( indx + attr.length, indx2 );
}

function set_style_attribute( style, attr, value ){
    attr = attr + ":";
    var indx = style.indexOf( attr );
    var indx2 = style.indexOf( ";", indx + attr.length );
    var prefix = "";
    if( indx > 0 ){
        prefix = style.substring( 0, indx - 1 );
    }
    return style = prefix + attr + value + style.substring( indx2 );
}

function drop( e ){
    var files = e.dataTransfer.files;

    // �u���E�U�̃f�t�H���g�̓����}��
    e.preventDefault();

    // �t�@�C���łȂ����̂��h���b�v���ꂽ�ꍇ
    if( files.length == 0 ){
        handleStream( e.dataTransfer.getData( "application/octet-stream" ) );
        return;
    }

    // 1�ڂ̃t�@�C��������舵��
    handleFile( files[0] );
}

function handleStream( dat ){
    var search = "data:application/octet-stream;base64,";
    if( dat.indexOf( search ) == 0 ){
        var b64 = dat.substring( search.length );
        var decoded = org.kbinani.Base64.decode( b64 );
        var stream = new org.kbinani.ByteArrayInputStream( decoded );
        var vsq = new org.kbinani.vsq.VsqFile( stream, "Shift_JIS" );
        org.kbinani.cadencii.AppManager.setVsqFile( vsq );
        updateDrawObjectList();
    }
}

function handleFile( file ){
    var reader = new FileReader();

    reader.onloadend = function(){
        var dat = reader.result;
        handleStream( dat );
    }

    reader.readAsDataURL( file );
}

function dragover( e ){
    e.preventDefault();
}

function dragleave( e ){
    dropbox.removeAttribute( "dragenter" );
}

window.addEventListener( "load", init, true );