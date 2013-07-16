package com.pyen.oplop.password;

import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

/**
 * This class reads the file specified by the oplop.testData system property,
 * and parses it so the tests can use the information.
 */
public class TestDataParser {
    public TestDataParser() throws IOException {
        String testDataFile = System.getProperty("oplop.testData");
        if (testDataFile == null) {
            throw new RuntimeException("Property oplop.testData must be set to the file to read test data from!");
        }
        init(testDataFile);
    }

    public TestDataParser(String testDataFile) throws IOException {
        init(testDataFile);
    }

    private void init(String testDataFile) throws IOException {
        BufferedReader br =
            new BufferedReader(new FileReader(testDataFile));

        m_data = new ArrayList<TestData>();
        for (String line = br.readLine(); line != null; line = br.readLine()) {
            if (lineHasData(line)) {
                String[] fields = line.split("\\s*:\\s*");
                String label = fields[0];
                String password = fields[1];
                String generatedPassword = fields[2];
                String rawHash = fields[3];
                m_data.add(new TestData(
                            label, password, generatedPassword, rawHash));
            }
        }
    }

    /**
     * Determine if a line has data to be parsed.
     * This is package scoped and static so that the test case for this
     * class can get a hold of it.
     */
    static boolean lineHasData(String line) {
        return !(line.startsWith("#") || line.trim().length() == 0);
    }

    public List<TestData> getData() {
        return m_data;
    }

    private List m_data;
}
