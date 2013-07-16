package com.pyen.oplop.password;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

import java.util.Vector;
import java.util.List;

import java.io.IOException;

public class PasswordGeneratorTest {
    @Before public void setup() throws IOException {
        TestDataParser parser = new TestDataParser();
        m_data = parser.getData();
    }
    @Test public void generatedPasswordTest() {
        doTest(new Proc() {
            public void run(TestData datum, PasswordGenerator pg) {
                assertEquals("Generated Password Test [" + datum + "]",
                    datum.getGeneratedPassword(), pg.generate());
            }
        });
    }
    @Test public void rawHashTest() {
        doTest(new Proc() {
            public void run(TestData datum, PasswordGenerator pg) {
                pg.generate();
                assertEquals("Raw Hash Test [" + datum + "]",
                    datum.getRawHash(), pg.getRawHash());
            }
        });
    }
    void doTest(Proc p) {
        for (TestData datum : m_data) {
            PasswordGenerator pg =
                new PasswordGenerator(datum.getLabel(), datum.getPassword());
            p.run(datum, pg);
        }
    }
    interface Proc {
        void run(TestData datum, PasswordGenerator pg);
    }
    private List<TestData> m_data;
}
