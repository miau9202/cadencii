﻿/*
 * TextBoxEx.cs
 * Copyright (c) 2008-2009 kbinani
 *
 * This file is part of Boare.Cadencii.
 *
 * Boare.Cadencii is free software; you can redistribute it and/or
 * modify it under the terms of the GPLv3 License.
 *
 * Boare.Cadencii is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
#if JAVA
//INCLUDE ..\BuildJavaUI\src\org\kbinani\Cadencii\TextBoxEx.java
#else
using System.Windows.Forms;
using bocoree.windows.forms;

namespace Boare.Cadencii {
    using boolean = System.Boolean;

    public class TextBoxEx : BTextBox {
        protected override boolean IsInputKey( Keys keyData ) {
            switch ( keyData ) {
                case Keys.Tab:
                case Keys.Tab | Keys.Shift:
                    break;
                default:
                    return base.IsInputKey( keyData );
            }
            return true;
        }
    }

}
#endif
