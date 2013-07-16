#!/usr/bin/env python

import sys
import os

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print "Usage %s [output.jad] [MANIFEST] [jar file]" % sys.argv[0]
        sys.exit(1)

    jad_name = sys.argv[1]
    mf_name = sys.argv[2]
    jar_name = sys.argv[3]

    print "Generating jad: %s" % jad_name

    mf = open(mf_name)
    jad = [ line for line in mf.readlines() if line.startswith("MIDlet") ]
    mf.close()

    jar_size = os.stat(jar_name).st_size
    jad.append("MIDlet-Jar-Size: %d\r\n" % jar_size)

    jad_file = open(jad_name, "w")
    jad_file.writelines(jad)
    jad_file.close()
