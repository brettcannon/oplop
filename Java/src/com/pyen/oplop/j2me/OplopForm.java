package com.pyen.oplop.j2me;

import javax.microedition.lcdui.Form;

public abstract class OplopForm extends Form {
    public OplopForm(String label) { super(label); }
    public abstract OplopForm getNextForm();
    /**
     * Subclasses should override this method if they need to update
     * anything when their form comes back into focus, like when a user
     * hits the back button to return to the form.
     */
    public void update() { }
}
