package com.ravi9689370oss.questhabit;

import android.app.AlertDialog;
import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

/**
 * Crash-proof entry point.
 *
 * Any exception thrown during Capacitor/Bridge/WebView initialization is
 * caught here and shown to the user as a visible error dialog instead of
 * letting the process die with a silent force-close.
 * This makes startup failures diagnosable (screenshot the dialog).
 */
public class MainActivity extends BridgeActivity {
    private static final String TAG = "QuestHabit";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            super.onCreate(savedInstanceState);
        } catch (Throwable t) {
            Log.e(TAG, "FATAL: crash in MainActivity.onCreate", t);
            showFatalError(t);
        }
    }

    @Override
    protected void onResume() {
        try {
            super.onResume();
        } catch (Throwable t) {
            Log.e(TAG, "FATAL: crash in MainActivity.onResume", t);
            showFatalError(t);
        }
    }

    @Override
    protected void onStart() {
        try {
            super.onStart();
        } catch (Throwable t) {
            Log.e(TAG, "FATAL: crash in MainActivity.onStart", t);
            showFatalError(t);
        }
    }

    /**
     * Last-resort safety net: if the bridge/webview dies after creation,
     * show the reason instead of an invisible force-close.
     */
    private void showFatalError(Throwable t) {
        try {
            String msg = "The app could not start.\n\n"
                    + (t != null && t.getMessage() != null ? t.getMessage() : "Unknown error")
                    + "\n\nPlease screenshot this message and send it to the developer.";
            new AlertDialog.Builder(this)
                    .setTitle("QuestHabit — startup error")
                    .setMessage(msg)
                    .setCancelable(false)
                    .setPositiveButton("Close", (dialog, which) -> {
                        finishAndRemoveTask();
                    })
                    .show();
        } catch (Throwable dialogFailure) {
            Log.e(TAG, "Could not show error dialog", dialogFailure);
            finishAndRemoveTask();
        }
    }
}
