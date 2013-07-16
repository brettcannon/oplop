package com.pyen.oplop.j2me;

import java.util.Stack;

import javax.microedition.midlet.MIDletStateChangeException;
import javax.microedition.midlet.MIDlet;
import javax.microedition.lcdui.CommandListener;
import javax.microedition.lcdui.Command;
import javax.microedition.lcdui.Display;
import javax.microedition.lcdui.Displayable;

public class Main extends MIDlet implements CommandListener {
    private Display m_display;
    private Stack m_formStack;
    private boolean m_paused;

    public Main() {
        m_paused = false;
        m_formStack = new Stack();
    }

    public void startApp() throws MIDletStateChangeException {
        if (m_paused) {
            // we should already have a form set, since we were running
            // when we got paused, so just display the top of the form
            // stack
            m_paused = false;
            OplopForm form = (OplopForm)m_formStack.peek();
            form.update();
            m_display.setCurrent(form);
        }
        else {
            m_display = Display.getDisplay( this );
            setNewForm(new MainForm());
        }
    }

    public void pauseApp() {
        m_paused = true;
        notifyPaused();
    }

    public void destroyApp( boolean unconditional ) {
        //clean up
        // notify the system that we're ready for destruction
        notifyDestroyed();
    }

    public void commandAction( Command c, Displayable d ) {
        OplopForm form = (OplopForm)d;
        switch (c.getCommandType()) {
            case Command.BACK: setPrevForm(); break;
            case Command.OK: setNewForm(form.getNextForm()); break;
            case Command.EXIT: destroyApp(true); break;
        }
    }

    private void setNewForm(OplopForm f) {
        m_formStack.push(f);
        f.setCommandListener(this);
        m_display.setCurrent(f);
    }

    private void setPrevForm() {
        m_formStack.pop();
        if (m_formStack.empty()) {
            destroyApp(false);
        }
        else {
            OplopForm form = (OplopForm)m_formStack.peek();
            form.update();
            m_display.setCurrent(form);
        }
    }
}

