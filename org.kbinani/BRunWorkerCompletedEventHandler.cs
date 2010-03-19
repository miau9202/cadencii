﻿/*
 * BRunWorkerCompletedEventHandler.cs
 * Copyright (C) 2009-2010 kbinani
 *
 * This file is part of org.kbinani.
 *
 * org.kbinani is free software; you can redistribute it and/or
 * modify it under the terms of the BSD License.
 *
 * org.kbinani is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */
#if JAVA
//INCLUDE ..\BuildJavaUI\src\org\kbinani\componentmodel\BRunWorkerCompletedEventHandler.java
#else
using System;
using System.ComponentModel;
using System.Windows.Forms;

namespace org.kbinani.componentmodel {

    public class BRunWorkerCompletedEventHandler : BEventHandler {
        public BRunWorkerCompletedEventHandler( Object sender, String method_name )
            : base( sender, method_name, typeof( void ), typeof( Object ), typeof( RunWorkerCompletedEventArgs ) ) {
        }

        public BRunWorkerCompletedEventHandler( Type sender, String method_name )
            : base( sender, method_name, typeof( void ), typeof( Object ), typeof( RunWorkerCompletedEventArgs ) ) {
        }
    }

}
#endif
