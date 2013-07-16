package com.pyen.oplop.password;

import org.junit.Test;
import static org.junit.Assert.*;

import java.util.ArrayList;

public class TestDataTest {
    public static final String DATA =
        "A : Z : 123aMqoI : aMqoIBBkXIL143y-M3yuHA==";
    public static final String LABEL = "A";
    public static final String PASSWORD = "Z";
    public static final String GENERATED_PASSWORD = "123aMqoI";
    public static final String RAW_HASH = "aMqoIBBkXIL143y-M3yuHA==";

    @Test public void testToString() {
        TestData td = new TestData(
            LABEL, PASSWORD, GENERATED_PASSWORD, RAW_HASH);
        assertEquals("toString gives back the original data",
                DATA, td.toString());
    }
}
