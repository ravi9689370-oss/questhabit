# Keep rules — only relevant if minifyEnabled is ever turned on.
# Capacitor instantiates plugins and bridge classes reflectively,
# so they must never be stripped/renamed by R8.

# Capacitor core
-keep class com.getcapacitor.** { *; }
-keep class * extends com.getcapacitor.Plugin
-keep class * extends com.getcapacitor.BridgeActivity
-keep class * extends com.getcapacitor.BridgeFragment

# This app's native code
-keep class com.ravi9689370oss.questhabit.** { *; }

# AdMob plugin (Capacitor Community)
-keep class com.getcapacitor.community.admob.** { *; }

# Google Mobile Ads SDK
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }

# Annotation info used by Capacitor at runtime
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
