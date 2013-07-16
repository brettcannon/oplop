package com.pyen.oplop.j2me;

import javax.microedition.lcdui.Command;
import javax.microedition.lcdui.TextField;

import com.pyen.oplop.password.PasswordGenerator;

public class ResultForm extends OplopForm {
    public ResultForm(PasswordGenerator pg) {
        super("oplop results");
        this.append(new TextField(
            "Generated Password:", pg.generate(),
            8, TextField.ANY
        ));
        this.addCommand(new Command("Exit", Command.EXIT, 1));
        this.addCommand(new Command("Back", Command.BACK, 1));
    }

    public OplopForm getNextForm() {
        // There is no next form
        throw new NoNextFormException();
    }
}
