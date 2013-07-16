package com.pyen.oplop.j2me;

import java.util.Vector;
import java.util.Enumeration;

import javax.microedition.lcdui.TextField;
import javax.microedition.lcdui.Command;
import javax.microedition.lcdui.ChoiceGroup;

import com.pyen.oplop.password.PasswordGenerator;

public class MainForm extends OplopForm {
    private TextField m_label;
    private TextField m_password;
    private ChoiceGroup m_storedLabels;
    private LabelCache m_cache;

    public MainForm() {
        super("oplop");
        m_cache = LabelCache.getInstance();

        m_label = new TextField("Nickname", "", 255, TextField.ANY);
        append(m_label);

        m_storedLabels =
            new ChoiceGroup("", ChoiceGroup.POPUP);
        populateStoredLabels();
        append(m_storedLabels);

        m_password = new TextField("Password", "", 255, TextField.PASSWORD);
        append(m_password);

        addCommand(new Command("Ok", Command.OK, 1));
        addCommand(new Command("Back", Command.BACK, 1));
    }

    public OplopForm getNextForm() {
        String chosenLabel = "";
        if (m_label.size() > 0) {
            chosenLabel = m_label.getString();
        }
        else {
            for (int i=0; i<m_storedLabels.size(); i++) {
                if (m_storedLabels.isSelected(i)) {
                    chosenLabel = m_storedLabels.getString(i);
                    break;
                }
            }
        }
        m_cache.add(chosenLabel);
        return new ResultForm(new PasswordGenerator(
            chosenLabel, m_password.getString()));
    }

    public void update() {
        m_label.setString("");
        while (m_storedLabels.size() > 0) {
            m_storedLabels.delete(0);
        }
        populateStoredLabels();
    }

    private void populateStoredLabels() {
        Vector labels = m_cache.getLabels();
        if (labels.size() > 0) {
            Enumeration e = labels.elements();
            while (e.hasMoreElements()) {
                String label = (String)e.nextElement();
                m_storedLabels.append(label, null);
            }
        }
    }
}
