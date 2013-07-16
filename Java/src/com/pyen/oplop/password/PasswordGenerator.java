package com.pyen.oplop.password;

import java.util.Vector;
import java.util.Enumeration;

import com.twmacinta.util.MD5;
import biz.sourcecode.Base64Coder;

public class PasswordGenerator {
    private String m_label;
    private String m_password;
    private String m_rawHash;

    public static final int LENGTH = 8;

    public PasswordGenerator(String label, String password) {
        m_label = label;
        m_password = password;
    }

    public String generate() {
        MD5 md5 = new MD5();

        md5.Update(m_password);
        md5.Update(m_label);

        m_rawHash = new String(Base64Coder.urlSafeEncode(md5.Final()));

        String hash = requireDigit(m_rawHash);

        return hash.substring(0,LENGTH);
    }

    public String requireDigit(String password) {
        boolean foundDigits = false;
        StringBuffer digits = new StringBuffer();
        for (int i=0; i<password.length(); i++) {
            if (Character.isDigit(password.charAt(i))) {
                if (i<LENGTH) {
                    // in this case, we already have a number, so
                    // nothing for us to do.
                    return password;
                }
                else {
                    digits.append(password.charAt(i));
                    foundDigits = true;
                }
            }
            else {
                if (foundDigits) {
                    return digits.toString() + password;
                }
            }
        }
        return '1' + password;
    }

    /**
     * Only here for testing purposes. Not valid unless generate has been
     * called.
     */
    String getRawHash() {
        return m_rawHash;
    }

    public static void main(String a[]) {
        PasswordGenerator pg = new PasswordGenerator(a[0], a[1]);
        System.out.println(pg.generate());
    }
}
