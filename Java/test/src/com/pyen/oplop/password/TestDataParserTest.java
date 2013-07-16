package com.pyen.oplop.password;

import org.junit.Test;
import org.junit.Before;
import static org.junit.Assert.*;

import java.io.IOException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

public class TestDataParserTest {
    @Before public void loadTestData() throws IOException {
        String testDataFile = System.getProperty("oplop.testData");
        BufferedReader br =
            new BufferedReader(new FileReader(testDataFile));
        m_lines = new ArrayList<String>();
        for (String line = br.readLine(); line != null; line = br.readLine()) {
            if (TestDataParser.lineHasData(line)) {
                m_lines.add(line);
            }
        }
        TestDataParser parser = new TestDataParser();
        m_data = parser.getData();
    }
    @Test public void size() {
        assertEquals("Same amount of data after parsing",
                m_lines.size(), m_data.size());
    }
    @Test public void sameData() {
        Iterator<String> lineIter = m_lines.iterator();
        Iterator<TestData> dataIter = m_data.iterator();
        while (lineIter.hasNext() && dataIter.hasNext()) {
            TestData data = dataIter.next();
            String line = lineIter.next();
            assertEquals("Data is the same after parsing",
                    line, data.toString());
        }
    }
    private List<String> m_lines;
    private List<TestData> m_data;
}
