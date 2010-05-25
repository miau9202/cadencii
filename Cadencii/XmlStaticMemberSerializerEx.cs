﻿#if !JAVA
/*
 * XmlStaticMemberSerializerEx.cs
 * Copyright (C) 2010 kbinani
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
using System;
using org.kbinani.java.util;
using org.kbinani.xml;

namespace org.kbinani.cadencii {

    public class XmlStaticMemberSerializerEx : XmlStaticMemberSerializer {
        public XmlStaticMemberSerializerEx( Type item )
            : base( item ) {
        }

        protected override System.Reflection.Assembly Compile( string code ) {
            Vector<String> errors = new Vector<String>();
            return Utility.compileScript( code, errors );
        }

        public void deserialize( System.IO.Stream stream ) {
            base.Deserialize( stream );
        }

        public void serialize( System.IO.Stream stream, Object dumy_null_argument ) {
            base.Serialize( stream );
        }
    }

}
#endif