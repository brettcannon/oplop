package com.pyen.oplop.android;

import java.util.ArrayList;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;

import com.pyen.oplop.password.PasswordGenerator;

/**
 * Main activity for Oplop.  This activity will allow the user
 * to enter a label and a master password and Oplop will
 * return a password back to the user.
 * 
 * @author bchiang
 */
public class Oplop extends Activity {
  
	private AutoCompleteTextView mLabelText;
	private EditText mMasterPasswordText;
	private String mPasswordText;
	private LabelDbAdapter dbAdapter;
	private ArrayList<String> labels;
	
	/**
	 * Create a view to display to the user. The view will allow the user
	 * to input the label and master password so Oplop can generate a
	 * password back to the user.
	 */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.oplop_main);
        
        // Init database
        dbAdapter = new LabelDbAdapter(this);
        dbAdapter.open();
        
        Cursor labelsCursor = dbAdapter.fetchAllLabels();
        labels = new ArrayList<String>();
        
        if(labelsCursor != null){
        	int count = labelsCursor.getCount();
            labelsCursor.moveToFirst();
            
            for( int i = 0; i < count; i++){
            	int labelColumnIndex = labelsCursor.getColumnIndexOrThrow(
            	  LabelDbAdapter.KEY_LABEL);
            	String label = labelsCursor.getString(labelColumnIndex);
                if (!labels.contains(label))
                  labels.add(label);
            	labelsCursor.moveToNext();
            }	
        }
        
        mMasterPasswordText = (EditText) findViewById(R.id.master);
        
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_dropdown_item_1line, labels);
        mLabelText = (AutoCompleteTextView) findViewById(R.id.label);
        mLabelText.setAdapter(adapter);
      
        Button clearButton = (Button) findViewById(R.id.clear);
        Button generateButton = (Button) findViewById(R.id.generate);

        clearButton.setOnClickListener(new View.OnClickListener() {
        	public void onClick(View view) {
        	  clearFields();
        	}
          
        });
        
        generateButton.setOnClickListener(new View.OnClickListener() {
        	public void onClick(View view) {
        	  generatePassword();
        	  displayPassword();
        	}
          
        });
        
    }
    
    /**
     * Clear all the UI fields in the main view.
     */
    private void clearFields(){
       mLabelText.setText("");
 	   mMasterPasswordText.setText("");
    }
    
    /**
     * Generate the password base on the label and master password.
     */
    private void generatePassword(){
      
      String label = mLabelText.getText().toString();
      String password = mMasterPasswordText.getText().toString();
      PasswordGenerator generator = new PasswordGenerator(label,password);
      mPasswordText = generator.generate();
      
      updateDb(label);
    }
    
    /**
     * Update the SQLite database with the label the user just used.
     * @param label - A string that represents the label.
     */
    private void updateDb(String label){
      label = label.toLowerCase();
      dbAdapter.addLabel(label);
      
      if (!labels.contains(label))
        labels.add(label);
    
      ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
        android.R.layout.simple_dropdown_item_1line, labels);
      mLabelText.setAdapter(adapter);
    }
    
    /**
     * Create a dialog to display the password to the user.
     */
    private void displayPassword(){
    	new AlertDialog.Builder(Oplop.this)
    	  .setMessage(mPasswordText)
    	  .setIcon(R.drawable.oplop)
    	  .setTitle(R.string.text_generate)
    	  .setPositiveButton(R.string.button_ok, 
    			    new DialogInterface.OnClickListener() {
                      public void onClick(DialogInterface dialog, 
                    		              int whichButton) {
                      }
                })
    	  .show();
    }

}
