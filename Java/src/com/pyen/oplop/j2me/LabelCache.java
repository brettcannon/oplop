package com.pyen.oplop.j2me;

import java.util.Vector;
import java.util.Date;

import javax.microedition.rms.RecordStore;
import javax.microedition.rms.RecordComparator;
import javax.microedition.rms.RecordFilter;
import javax.microedition.rms.RecordEnumeration;
import javax.microedition.rms.RecordFilter;
import javax.microedition.rms.RecordStoreException;

/**
 * This class implements a MRU cache for labels.
 */
public class LabelCache {
    /**
     * Return an instance of the Label Cache.
     * @return an instance of the label cache
     */
    public static LabelCache getInstance() {
        if (s_instance == null) {
            s_instance = new LabelCache();
        }
        return s_instance;
    }

    /**
     * Add a label if it is not already in the cache, and update the use time
     * if the label is already in the cache.
     */
    public void add(String label) {
        if (m_rs != null) {
            try {
                // remove old copies of the label, so we can add a new one
                // with a new timestamp
                RecordEnumeration re =
                    m_rs.enumerateRecords(new LabelFilter(label), null, false);
                while (re.hasNextElement()) {
                    // There really should never be more than one record
                    // with the same label. If there is, delete the extra ones
                    // anyways.
                    int id = re.nextRecordId();
                    m_rs.deleteRecord(id);
                }

                String taggedLabel =
                    (new TaggedLabel(new Date(), label)).toString();
                byte[] labelBytes = taggedLabel.getBytes();
                if (labelBytes.length > m_rs.getSizeAvailable()) {
                    // looks like we're running out of space, we should delete
                    // some older entries.
                    deleteOldEntries(labelBytes.length);
                }
                m_rs.addRecord(labelBytes, 0, labelBytes.length);
            }
            catch (RecordStoreException rse) {
                // catch all the checked exceptions that could be thrown above,
                // and deliberately ignore them. If this breaks, we don't want
                // it to break the functionality of the app.
            }
        }
    }

    /**
     * Helper method to delete the old entires from the store to free up space.
     * @param spaceNeeded the amount of space (in bytes) needed to be freed
     * @throws RecordStoreException if an error occurs
     * @throws InvalidRecordIDException if enough records can't be deleted to
     * free up the needed space.
     */
    private void deleteOldEntries(int spaceNeeded) throws RecordStoreException {
        RecordEnumeration re =
            m_rs.enumerateRecords(null, new ReverseLabelComparator(), false);
        int freedSpace = 0;
        while (freedSpace < spaceNeeded) {
            int id = re.nextRecordId();
            freedSpace += m_rs.getRecordSize(id);
            m_rs.deleteRecord(id);
        }
    }

    /**
     * Get all the labels, in order from most recently used to least.
     */
    public Vector getLabels() {
        Vector labels = new Vector();
        if (m_rs != null) {
            try {
                RecordEnumeration re =
                    m_rs.enumerateRecords(null, new LabelComparator(), false);
                while (re.hasNextElement()) {
                    byte[] record = re.nextRecord();
                    TaggedLabel label = new TaggedLabel(new String(record));
                    labels.addElement(label.getLabel());
                }
            }
            catch (RecordStoreException rse) {
                // catch all the checked exceptions that could be thrown above,
                // and deliberately ignore them. If this breaks, we don't want
                // it to break the functionality of the app.
            }
        }
        return labels;
    }

    private LabelCache() {
        try {
            m_rs = RecordStore.openRecordStore("LabelCache", true);
        }
        catch (RecordStoreException rse) {
            // if we can't create the record store, we're just going to run
            // in dummy mode.
            m_rs = null;
        }
    }

    private RecordStore m_rs;
    private static LabelCache s_instance = null;

    private class TaggedLabel {
        public final static String TAG_SEP = "|";
        public TaggedLabel(String taggedLabel) {
            int sep = taggedLabel.indexOf(TAG_SEP);
            String tag = taggedLabel.substring(0, sep);
            m_tag = new Date(Long.parseLong(tag));
            m_label = taggedLabel.substring(sep+1);
        }

        public TaggedLabel(Date tag, String label) {
            m_tag = tag;
            m_label = label;
        }

        public Date getTag() {
            return new Date(m_tag.getTime());
        }

        public String getLabel() {
            return m_label;
        }
        
        public String toString() {
            return m_tag.getTime() + TAG_SEP + m_label;
        }

        public boolean equals(Object o) {
            if (o instanceof TaggedLabel) {
                TaggedLabel label = (TaggedLabel)o;
                return m_tag.equals(label.getTag()) &&
                    m_label.equals(label.getLabel());
            }
            else {
                return false;
            }
        }

        public int hashCode() {
            int hash = 7;
            hash = 31 * hash + m_tag.hashCode();
            hash = 31 * hash + m_label.hashCode();

            return hash;
        }

        /**
         * The sort order enforced by this is decending by tag, so the more
         * recent tags come first.
         */
        public int compareTo(TaggedLabel label) {
            if (m_tag.equals(label.getTag())) {
                return m_label.compareTo(label.getLabel());
            }
            else if (m_tag.getTime() < label.getTag().getTime()) {
                return 1;
            }
            else {
                return -1;
            }
        }

        private Date m_tag;
        private String m_label;
    }

    private class LabelFilter implements RecordFilter {
        public LabelFilter(String label) {
            m_label = label;
        }

        public boolean matches(byte[] candidate) {
            TaggedLabel label = new TaggedLabel(new String(candidate));
            return m_label.equals(label.getLabel());
        }

        private String m_label;
    }

    /**
     * Orders the labels from newest to oldest.
     */
    private class LabelComparator implements RecordComparator {
        public LabelComparator() { }

        public int compare(byte[] rec1, byte[] rec2) {
            TaggedLabel label1 = new TaggedLabel(new String(rec1));
            TaggedLabel label2 = new TaggedLabel(new String(rec2));

            return label1.compareTo(label2);
        }
    }

    /**
     * Orders the labels from oldest to newest.
     */
    private class ReverseLabelComparator implements RecordComparator {
        public ReverseLabelComparator() { }

        public int compare(byte[] rec1, byte[] rec2) {
            TaggedLabel label1 = new TaggedLabel(new String(rec1));
            TaggedLabel label2 = new TaggedLabel(new String(rec2));

            return label2.compareTo(label1);
        }
    }
}
