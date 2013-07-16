package com.pyen.oplop.password;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public class TestData {
    public TestData(String label, String password, String generatedPassword, String rawHash) {
        m_label = label;
        m_password = password;
        m_generatedPassword = generatedPassword;
        m_rawHash = rawHash;
    }

    public String getLabel() {
        return m_label;
    }

    public String getPassword() {
        return m_password;
    }

    public String getGeneratedPassword() {
        return m_generatedPassword;
    }

    public String getRawHash() {
        return m_rawHash;
    }

    public String toString() {
        StringBuffer str = new StringBuffer();
        str.append(m_label).append(" : ");
        str.append(m_password).append(" : ");
        str.append(m_generatedPassword).append(" : ");
        str.append(m_rawHash);
        return str.toString();
    }

    private String m_label;
    private String m_password;
    private String m_generatedPassword;
    private String m_rawHash;
}
