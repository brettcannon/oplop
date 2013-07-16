package com.pyen.oplop.android;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * A database helper class that allows us to run CRUD operations on the labels
 * for Oplop.
 * 
 * @author bchiang
 */
public class LabelDbAdapter {

    public static final String KEY_LABEL = "label";
    public static final String KEY_ROWID = "_id";
    
    private static final String DATABASE_NAME = "oplop";
    private static final String DATABASE_TABLE = "labels";
    private static final int DATABASE_VERSION = 1;

    private DatabaseHelper mDbHelper;
    private SQLiteDatabase mDb;
    
    private final Context mCtx;
    
    // Database creation sql statement
    private static final String DATABASE_CREATE = "create table " + 
      DATABASE_TABLE + " (" + KEY_ROWID +
      " integer primary key autoincrement, " + KEY_LABEL + " text not null);";

    /**
     * A Database helper class that communicates with the android
     * SQLite database.
     * 
     * @author bchiang
     */
    private static class DatabaseHelper extends SQLiteOpenHelper {

        DatabaseHelper(Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {

            db.execSQL(DATABASE_CREATE);
        }
        
        @Override
        public void onUpgrade(SQLiteDatabase db, int newVersion,
        		              int oldVersion){
        	
        }

    }

    /**
     * Constructor - takes the context to allow the database to be
     * opened/created
     * 
     * @param ctx the Context within which to work
     */
    public LabelDbAdapter(Context ctx) {
        this.mCtx = ctx;
    }

    /**
     * Open the label database. If it cannot be opened, try to create a new
     * instance of the database. If it cannot be created, throw an exception to
     * signal the failure
     * 
     * @return this (self reference, allowing this to be chained in an
     *         initialization call)
     * @throws SQLException if the database could be neither opened or created
     */
    public LabelDbAdapter open() throws SQLException {
        mDbHelper = new DatabaseHelper(mCtx);
        mDb = mDbHelper.getWritableDatabase();
        return this;
    }
    
    public void close() {
        mDbHelper.close();
    }


    /**
     * Create a new label using the label provided. If the label is
     * successfully created return the new rowId for that label, otherwise return
     * a -1 to indicate failure.
     * 
     * @param label the label that the user used to generate password.
     * @return rowId or -1 if failed
     */
    public long addLabel(String label) {
        ContentValues initialValues = new ContentValues();
        initialValues.put(KEY_LABEL, label);

        return mDb.insert(DATABASE_TABLE, null, initialValues);
    }

    /**
     * Delete the label with the given rowId
     * 
     * @param rowId id of label to delete
     * @return true if deleted, false otherwise
     */
    public boolean deleteLabel(long rowId) {

        return mDb.delete(DATABASE_TABLE, KEY_ROWID + "=" + rowId, null) > 0;
    }

    /**
     * Return a Cursor over the list of all labels in the database
     * 
     * @return Cursor over all labels
     */
    public Cursor fetchAllLabels() {
      
      Cursor cursor = null;
      
      cursor = mDb.query(DATABASE_TABLE, new String[] {KEY_ROWID, KEY_LABEL}, 
        null, null, null, null, null);        

      return cursor; 
    }
}
