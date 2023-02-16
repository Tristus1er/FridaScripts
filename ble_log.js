/*  Android BT and BLE log
	by Tristan SALAUN
	
	Run with:
	frida -U -f [APP_ID] -l aaaaa.js --no-pause
*/

function toHexString(byteArray) {
	return '[0x' + Array.from(byteArray, function(byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join(' 0x') + ']'
}
function toAsciiString(byteArray) {
	return Array.from(byteArray, function(byte) {
		return String.fromCharCode(byte);
	}).join('')
}

setTimeout(function() {
    Java.perform(function() {
        console.log('');
        console.log('======');
        console.log('[#] Android Log BLE/BT methods [#]');
        console.log('======');
        //console.log('Java.available:     \t' + Java.available);
		//console.log('Java.androidVersion:\t' + Java.androidVersion);

		const serviceMap= new Map();

		// From https://gist.github.com/sam016/4abe921b5a9ee27f67b3686910293026
		serviceMap.set("00001800-0000-1000-8000-00805f9b34fb", "Generic Access");
		serviceMap.set("00001801-0000-1000-8000-00805f9b34fb", "Generic Attribute");
		serviceMap.set("00001802-0000-1000-8000-00805f9b34fb", "Immediate Alert");
		serviceMap.set("00001803-0000-1000-8000-00805f9b34fb", "Link Loss");
		serviceMap.set("00001804-0000-1000-8000-00805f9b34fb", "Tx Power");
		serviceMap.set("00001805-0000-1000-8000-00805f9b34fb", "Current Time Service");
		serviceMap.set("00001806-0000-1000-8000-00805f9b34fb", "Reference Time Update Service");
		serviceMap.set("00001807-0000-1000-8000-00805f9b34fb", "Next DST Change Service");
		serviceMap.set("00001808-0000-1000-8000-00805f9b34fb", "Glucose");
		serviceMap.set("00001809-0000-1000-8000-00805f9b34fb", "Health Thermometer");
		serviceMap.set("0000180a-0000-1000-8000-00805f9b34fb", "Device Information");
		serviceMap.set("0000180d-0000-1000-8000-00805f9b34fb", "Heart Rate");
		serviceMap.set("0000180e-0000-1000-8000-00805f9b34fb", "Phone Alert Status Service");
		serviceMap.set("0000180f-0000-1000-8000-00805f9b34fb", "Battery Service");
		serviceMap.set("00001810-0000-1000-8000-00805f9b34fb", "Blood Pressure");
		serviceMap.set("00001811-0000-1000-8000-00805f9b34fb", "Alert Notification Service");
		serviceMap.set("00001812-0000-1000-8000-00805f9b34fb", "Human Interface Device");
		serviceMap.set("00001813-0000-1000-8000-00805f9b34fb", "Scan Parameters");
		serviceMap.set("00001814-0000-1000-8000-00805f9b34fb", "Running Speed and Cadence");
		serviceMap.set("00001815-0000-1000-8000-00805f9b34fb", "Automation IO");
		serviceMap.set("00001816-0000-1000-8000-00805f9b34fb", "Cycling Speed and Cadence");
		serviceMap.set("00001818-0000-1000-8000-00805f9b34fb", "Cycling Power");
		serviceMap.set("00001819-0000-1000-8000-00805f9b34fb", "Location and Navigation");
		serviceMap.set("0000181a-0000-1000-8000-00805f9b34fb", "Environmental Sensing");
		serviceMap.set("0000181b-0000-1000-8000-00805f9b34fb", "Body Composition");
		serviceMap.set("0000181c-0000-1000-8000-00805f9b34fb", "User Data");
		serviceMap.set("0000181d-0000-1000-8000-00805f9b34fb", "Weight Scale");
		serviceMap.set("0000181e-0000-1000-8000-00805f9b34fb", "Bond Management Service");
		serviceMap.set("0000181f-0000-1000-8000-00805f9b34fb", "Continuous Glucose Monitoring");
		serviceMap.set("00001820-0000-1000-8000-00805f9b34fb", "Internet Protocol Support Service");
		serviceMap.set("00001821-0000-1000-8000-00805f9b34fb", "Indoor Positioning");
		serviceMap.set("00001822-0000-1000-8000-00805f9b34fb", "Pulse Oximeter Service");
		serviceMap.set("00001823-0000-1000-8000-00805f9b34fb", "HTTP Proxy");
		serviceMap.set("00001824-0000-1000-8000-00805f9b34fb", "Transport Discovery");
		serviceMap.set("00001825-0000-1000-8000-00805f9b34fb", "Object Transfer Service");
		serviceMap.set("00001826-0000-1000-8000-00805f9b34fb", "Fitness Machine");
		serviceMap.set("00001827-0000-1000-8000-00805f9b34fb", "Mesh Provisioning Service");
		serviceMap.set("00001828-0000-1000-8000-00805f9b34fb", "Mesh Proxy Service");
		serviceMap.set("00001829-0000-1000-8000-00805f9b34fb", "Reconnection Configuration");

		const characteristicMap= new Map();
		characteristicMap.set('08830002-8535-b5a0-7140-a30401f45cb7', 'GATT_CHARACTERISTIC_ECG');
		characteristicMap.set('00002902-0000-1000-8000-00805f9b34fb', 'GATT_NOTIFICATION_DESCRIPTOR');

		characteristicMap.set("00002a00-0000-1000-8000-00805f9b34fb", "Device Name");
		characteristicMap.set("00002a01-0000-1000-8000-00805f9b34fb", "Appearance");
		characteristicMap.set("00002a02-0000-1000-8000-00805f9b34fb", "Peripheral Privacy Flag");
		characteristicMap.set("00002a03-0000-1000-8000-00805f9b34fb", "Reconnection Address");
		characteristicMap.set("00002a04-0000-1000-8000-00805f9b34fb", "Peripheral Preferred Connection Parameters");
		characteristicMap.set("00002a05-0000-1000-8000-00805f9b34fb", "Service Changed");
		characteristicMap.set("00002a06-0000-1000-8000-00805f9b34fb", "Alert Level");
		characteristicMap.set("00002a07-0000-1000-8000-00805f9b34fb", "Tx Power Level");
		characteristicMap.set("00002a08-0000-1000-8000-00805f9b34fb", "Date Time");
		characteristicMap.set("00002a09-0000-1000-8000-00805f9b34fb", "Day of Week");
		characteristicMap.set("00002a0a-0000-1000-8000-00805f9b34fb", "Day Date Time");
		characteristicMap.set("00002a0b-0000-1000-8000-00805f9b34fb", "Exact Time 100");
		characteristicMap.set("00002a0c-0000-1000-8000-00805f9b34fb", "Exact Time 256");
		characteristicMap.set("00002a0d-0000-1000-8000-00805f9b34fb", "DST Offset");
		characteristicMap.set("00002a0e-0000-1000-8000-00805f9b34fb", "Time Zone");
		characteristicMap.set("00002a0f-0000-1000-8000-00805f9b34fb", "Local Time Information");
		characteristicMap.set("00002a10-0000-1000-8000-00805f9b34fb", "Secondary Time Zone");
		characteristicMap.set("00002a11-0000-1000-8000-00805f9b34fb", "Time with DST");
		characteristicMap.set("00002a12-0000-1000-8000-00805f9b34fb", "Time Accuracy");
		characteristicMap.set("00002a13-0000-1000-8000-00805f9b34fb", "Time Source");
		characteristicMap.set("00002a14-0000-1000-8000-00805f9b34fb", "Reference Time Information");
		characteristicMap.set("00002a15-0000-1000-8000-00805f9b34fb", "Time Broadcast");
		characteristicMap.set("00002a16-0000-1000-8000-00805f9b34fb", "Time Update Control Point");
		characteristicMap.set("00002a17-0000-1000-8000-00805f9b34fb", "Time Update State");
		characteristicMap.set("00002a18-0000-1000-8000-00805f9b34fb", "Glucose Measurement");
		characteristicMap.set("00002a19-0000-1000-8000-00805f9b34fb", "Battery Level");
		characteristicMap.set("00002a1a-0000-1000-8000-00805f9b34fb", "Battery Power State");
		characteristicMap.set("00002a1b-0000-1000-8000-00805f9b34fb", "Battery Level State");
		characteristicMap.set("00002a1c-0000-1000-8000-00805f9b34fb", "Temperature Measurement");
		characteristicMap.set("00002a1d-0000-1000-8000-00805f9b34fb", "Temperature Type");
		characteristicMap.set("00002a1e-0000-1000-8000-00805f9b34fb", "Intermediate Temperature");
		characteristicMap.set("00002a1f-0000-1000-8000-00805f9b34fb", "Temperature Celsius");
		characteristicMap.set("00002a20-0000-1000-8000-00805f9b34fb", "Temperature Fahrenheit");
		characteristicMap.set("00002a21-0000-1000-8000-00805f9b34fb", "Measurement Interval");
		characteristicMap.set("00002a22-0000-1000-8000-00805f9b34fb", "Boot Keyboard Input Report");
		characteristicMap.set("00002a23-0000-1000-8000-00805f9b34fb", "System ID");
		characteristicMap.set("00002a24-0000-1000-8000-00805f9b34fb", "Model Number String");
		characteristicMap.set("00002a25-0000-1000-8000-00805f9b34fb", "Serial Number String");
		characteristicMap.set("00002a26-0000-1000-8000-00805f9b34fb", "Firmware Revision String");
		characteristicMap.set("00002a27-0000-1000-8000-00805f9b34fb", "Hardware Revision String");
		characteristicMap.set("00002a28-0000-1000-8000-00805f9b34fb", "Software Revision String");
		characteristicMap.set("00002a29-0000-1000-8000-00805f9b34fb", "Manufacturer Name String");
		characteristicMap.set("00002a2a-0000-1000-8000-00805f9b34fb", "IEEE 11073-20601 Regulatory Certification Data List");
		characteristicMap.set("00002a2b-0000-1000-8000-00805f9b34fb", "Current Time");
		characteristicMap.set("00002a2c-0000-1000-8000-00805f9b34fb", "Magnetic Declination");
		characteristicMap.set("00002a2f-0000-1000-8000-00805f9b34fb", "Position 2D");
		characteristicMap.set("00002a30-0000-1000-8000-00805f9b34fb", "Position 3D");
		characteristicMap.set("00002a31-0000-1000-8000-00805f9b34fb", "Scan Refresh");
		characteristicMap.set("00002a32-0000-1000-8000-00805f9b34fb", "Boot Keyboard Output Report");
		characteristicMap.set("00002a33-0000-1000-8000-00805f9b34fb", "Boot Mouse Input Report");
		characteristicMap.set("00002a34-0000-1000-8000-00805f9b34fb", "Glucose Measurement Context");
		characteristicMap.set("00002a35-0000-1000-8000-00805f9b34fb", "Blood Pressure Measurement");
		characteristicMap.set("00002a36-0000-1000-8000-00805f9b34fb", "Intermediate Cuff Pressure");
		characteristicMap.set("00002a37-0000-1000-8000-00805f9b34fb", "Heart Rate Measurement");
		characteristicMap.set("00002a38-0000-1000-8000-00805f9b34fb", "Body Sensor Location");
		characteristicMap.set("00002a39-0000-1000-8000-00805f9b34fb", "Heart Rate Control Point");
		characteristicMap.set("00002a3a-0000-1000-8000-00805f9b34fb", "Removable");
		characteristicMap.set("00002a3b-0000-1000-8000-00805f9b34fb", "Service Required");
		characteristicMap.set("00002a3c-0000-1000-8000-00805f9b34fb", "Scientific Temperature Celsius");
		characteristicMap.set("00002a3d-0000-1000-8000-00805f9b34fb", "String");
		characteristicMap.set("00002a3e-0000-1000-8000-00805f9b34fb", "Network Availability");
		characteristicMap.set("00002a3f-0000-1000-8000-00805f9b34fb", "Alert Status");
		characteristicMap.set("00002a40-0000-1000-8000-00805f9b34fb", "Ringer Control point");
		characteristicMap.set("00002a41-0000-1000-8000-00805f9b34fb", "Ringer Setting");
		characteristicMap.set("00002a42-0000-1000-8000-00805f9b34fb", "Alert Category ID Bit Mask");
		characteristicMap.set("00002a43-0000-1000-8000-00805f9b34fb", "Alert Category ID");
		characteristicMap.set("00002a44-0000-1000-8000-00805f9b34fb", "Alert Notification Control Point");
		characteristicMap.set("00002a45-0000-1000-8000-00805f9b34fb", "Unread Alert Status");
		characteristicMap.set("00002a46-0000-1000-8000-00805f9b34fb", "New Alert");
		characteristicMap.set("00002a47-0000-1000-8000-00805f9b34fb", "Supported New Alert Category");
		characteristicMap.set("00002a48-0000-1000-8000-00805f9b34fb", "Supported Unread Alert Category");
		characteristicMap.set("00002a49-0000-1000-8000-00805f9b34fb", "Blood Pressure Feature");
		characteristicMap.set("00002a4a-0000-1000-8000-00805f9b34fb", "HID Information");
		characteristicMap.set("00002a4b-0000-1000-8000-00805f9b34fb", "Report Map");
		characteristicMap.set("00002a4c-0000-1000-8000-00805f9b34fb", "HID Control Point");
		characteristicMap.set("00002a4d-0000-1000-8000-00805f9b34fb", "Report");
		characteristicMap.set("00002a4e-0000-1000-8000-00805f9b34fb", "Protocol Mode");
		characteristicMap.set("00002a4f-0000-1000-8000-00805f9b34fb", "Scan Interval Window");
		characteristicMap.set("00002a50-0000-1000-8000-00805f9b34fb", "PnP ID");
		characteristicMap.set("00002a51-0000-1000-8000-00805f9b34fb", "Glucose Feature");
		characteristicMap.set("00002a52-0000-1000-8000-00805f9b34fb", "Record Access Control Point");
		characteristicMap.set("00002a53-0000-1000-8000-00805f9b34fb", "RSC Measurement");
		characteristicMap.set("00002a54-0000-1000-8000-00805f9b34fb", "RSC Feature");
		characteristicMap.set("00002a55-0000-1000-8000-00805f9b34fb", "SC Control Point");
		characteristicMap.set("00002a56-0000-1000-8000-00805f9b34fb", "Digital");
		characteristicMap.set("00002a57-0000-1000-8000-00805f9b34fb", "Digital Output");
		characteristicMap.set("00002a58-0000-1000-8000-00805f9b34fb", "Analog");
		characteristicMap.set("00002a59-0000-1000-8000-00805f9b34fb", "Analog Output");
		characteristicMap.set("00002a5a-0000-1000-8000-00805f9b34fb", "Aggregate");
		characteristicMap.set("00002a5b-0000-1000-8000-00805f9b34fb", "CSC Measurement");
		characteristicMap.set("00002a5c-0000-1000-8000-00805f9b34fb", "CSC Feature");
		characteristicMap.set("00002a5d-0000-1000-8000-00805f9b34fb", "Sensor Location");
		characteristicMap.set("00002a5e-0000-1000-8000-00805f9b34fb", "PLX Spot-Check Measurement");
		characteristicMap.set("00002a5f-0000-1000-8000-00805f9b34fb", "PLX Continuous Measurement Characteristic");
		characteristicMap.set("00002a60-0000-1000-8000-00805f9b34fb", "PLX Features");
		characteristicMap.set("00002a62-0000-1000-8000-00805f9b34fb", "Pulse Oximetry Control Point");
		characteristicMap.set("00002a63-0000-1000-8000-00805f9b34fb", "Cycling Power Measurement");
		characteristicMap.set("00002a64-0000-1000-8000-00805f9b34fb", "Cycling Power Vector");
		characteristicMap.set("00002a65-0000-1000-8000-00805f9b34fb", "Cycling Power Feature");
		characteristicMap.set("00002a66-0000-1000-8000-00805f9b34fb", "Cycling Power Control Point");
		characteristicMap.set("00002a67-0000-1000-8000-00805f9b34fb", "Location and Speed Characteristic");
		characteristicMap.set("00002a68-0000-1000-8000-00805f9b34fb", "Navigation");
		characteristicMap.set("00002a69-0000-1000-8000-00805f9b34fb", "Position Quality");
		characteristicMap.set("00002a6a-0000-1000-8000-00805f9b34fb", "LN Feature");
		characteristicMap.set("00002a6b-0000-1000-8000-00805f9b34fb", "LN Control Point");
		characteristicMap.set("00002a6c-0000-1000-8000-00805f9b34fb", "Elevation");
		characteristicMap.set("00002a6d-0000-1000-8000-00805f9b34fb", "Pressure");
		characteristicMap.set("00002a6e-0000-1000-8000-00805f9b34fb", "Temperature");
		characteristicMap.set("00002a6f-0000-1000-8000-00805f9b34fb", "Humidity");
		characteristicMap.set("00002a70-0000-1000-8000-00805f9b34fb", "True Wind Speed");
		characteristicMap.set("00002a71-0000-1000-8000-00805f9b34fb", "True Wind Direction");
		characteristicMap.set("00002a72-0000-1000-8000-00805f9b34fb", "Apparent Wind Speed");
		characteristicMap.set("00002a73-0000-1000-8000-00805f9b34fb", "Apparent Wind Direction");
		characteristicMap.set("00002a74-0000-1000-8000-00805f9b34fb", "Gust Factor");
		characteristicMap.set("00002a75-0000-1000-8000-00805f9b34fb", "Pollen Concentration");
		characteristicMap.set("00002a76-0000-1000-8000-00805f9b34fb", "UV Index");
		characteristicMap.set("00002a77-0000-1000-8000-00805f9b34fb", "Irradiance");
		characteristicMap.set("00002a78-0000-1000-8000-00805f9b34fb", "Rainfall");
		characteristicMap.set("00002a79-0000-1000-8000-00805f9b34fb", "Wind Chill");
		characteristicMap.set("00002a7a-0000-1000-8000-00805f9b34fb", "Heat Index");
		characteristicMap.set("00002a7b-0000-1000-8000-00805f9b34fb", "Dew Point");
		characteristicMap.set("00002a7d-0000-1000-8000-00805f9b34fb", "Descriptor Value Changed");
		characteristicMap.set("00002a7e-0000-1000-8000-00805f9b34fb", "Aerobic Heart Rate Lower Limit");
		characteristicMap.set("00002a7f-0000-1000-8000-00805f9b34fb", "Aerobic Threshold");
		characteristicMap.set("00002a80-0000-1000-8000-00805f9b34fb", "Age");
		characteristicMap.set("00002a81-0000-1000-8000-00805f9b34fb", "Anaerobic Heart Rate Lower Limit");
		characteristicMap.set("00002a82-0000-1000-8000-00805f9b34fb", "Anaerobic Heart Rate Upper Limit");
		characteristicMap.set("00002a83-0000-1000-8000-00805f9b34fb", "Anaerobic Threshold");
		characteristicMap.set("00002a84-0000-1000-8000-00805f9b34fb", "Aerobic Heart Rate Upper Limit");
		characteristicMap.set("00002a85-0000-1000-8000-00805f9b34fb", "Date of Birth");
		characteristicMap.set("00002a86-0000-1000-8000-00805f9b34fb", "Date of Threshold Assessment");
		characteristicMap.set("00002a87-0000-1000-8000-00805f9b34fb", "Email Address");
		characteristicMap.set("00002a88-0000-1000-8000-00805f9b34fb", "Fat Burn Heart Rate Lower Limit");
		characteristicMap.set("00002a89-0000-1000-8000-00805f9b34fb", "Fat Burn Heart Rate Upper Limit");
		characteristicMap.set("00002a8a-0000-1000-8000-00805f9b34fb", "First Name");
		characteristicMap.set("00002a8b-0000-1000-8000-00805f9b34fb", "Five Zone Heart Rate Limits");
		characteristicMap.set("00002a8c-0000-1000-8000-00805f9b34fb", "Gender");
		characteristicMap.set("00002a8d-0000-1000-8000-00805f9b34fb", "Heart Rate Max");
		characteristicMap.set("00002a8e-0000-1000-8000-00805f9b34fb", "Height");
		characteristicMap.set("00002a8f-0000-1000-8000-00805f9b34fb", "Hip Circumference");
		characteristicMap.set("00002a90-0000-1000-8000-00805f9b34fb", "Last Name");
		characteristicMap.set("00002a91-0000-1000-8000-00805f9b34fb", "Maximum Recommended Heart Rate");
		characteristicMap.set("00002a92-0000-1000-8000-00805f9b34fb", "Resting Heart Rate");
		characteristicMap.set("00002a93-0000-1000-8000-00805f9b34fb", "Sport Type for Aerobic and Anaerobic Thresholds");
		characteristicMap.set("00002a94-0000-1000-8000-00805f9b34fb", "Three Zone Heart Rate Limits");
		characteristicMap.set("00002a95-0000-1000-8000-00805f9b34fb", "Two Zone Heart Rate Limit");
		characteristicMap.set("00002a96-0000-1000-8000-00805f9b34fb", "VO2 Max");
		characteristicMap.set("00002a97-0000-1000-8000-00805f9b34fb", "Waist Circumference");
		characteristicMap.set("00002a98-0000-1000-8000-00805f9b34fb", "Weight");
		characteristicMap.set("00002a99-0000-1000-8000-00805f9b34fb", "Database Change Increment");
		characteristicMap.set("00002a9a-0000-1000-8000-00805f9b34fb", "User Index");
		characteristicMap.set("00002a9b-0000-1000-8000-00805f9b34fb", "Body Composition Feature");
		characteristicMap.set("00002a9c-0000-1000-8000-00805f9b34fb", "Body Composition Measurement");
		characteristicMap.set("00002a9d-0000-1000-8000-00805f9b34fb", "Weight Measurement");
		characteristicMap.set("00002a9e-0000-1000-8000-00805f9b34fb", "Weight Scale Feature");
		characteristicMap.set("00002a9f-0000-1000-8000-00805f9b34fb", "User Control Point");
		characteristicMap.set("00002aa0-0000-1000-8000-00805f9b34fb", "Magnetic Flux Density - 2D");
		characteristicMap.set("00002aa1-0000-1000-8000-00805f9b34fb", "Magnetic Flux Density - 3D");
		characteristicMap.set("00002aa2-0000-1000-8000-00805f9b34fb", "Language");
		characteristicMap.set("00002aa3-0000-1000-8000-00805f9b34fb", "Barometric Pressure Trend");
		characteristicMap.set("00002aa4-0000-1000-8000-00805f9b34fb", "Bond Management Control Point");
		characteristicMap.set("00002aa5-0000-1000-8000-00805f9b34fb", "Bond Management Features");
		characteristicMap.set("00002aa6-0000-1000-8000-00805f9b34fb", "Central Address Resolution");
		characteristicMap.set("00002aa7-0000-1000-8000-00805f9b34fb", "CGM Measurement");
		characteristicMap.set("00002aa8-0000-1000-8000-00805f9b34fb", "CGM Feature");
		characteristicMap.set("00002aa9-0000-1000-8000-00805f9b34fb", "CGM Status");
		characteristicMap.set("00002aaa-0000-1000-8000-00805f9b34fb", "CGM Session Start Time");
		characteristicMap.set("00002aab-0000-1000-8000-00805f9b34fb", "CGM Session Run Time");
		characteristicMap.set("00002aac-0000-1000-8000-00805f9b34fb", "CGM Specific Ops Control Point");
		characteristicMap.set("00002aad-0000-1000-8000-00805f9b34fb", "Indoor Positioning Configuration");
		characteristicMap.set("00002aae-0000-1000-8000-00805f9b34fb", "Latitude");
		characteristicMap.set("00002aaf-0000-1000-8000-00805f9b34fb", "Longitude");
		characteristicMap.set("00002ab0-0000-1000-8000-00805f9b34fb", "Local North Coordinate");
		characteristicMap.set("00002ab1-0000-1000-8000-00805f9b34fb", "Local East Coordinate");
		characteristicMap.set("00002ab2-0000-1000-8000-00805f9b34fb", "Floor Number");
		characteristicMap.set("00002ab3-0000-1000-8000-00805f9b34fb", "Altitude");
		characteristicMap.set("00002ab4-0000-1000-8000-00805f9b34fb", "Uncertainty");
		characteristicMap.set("00002ab5-0000-1000-8000-00805f9b34fb", "Location Name");
		characteristicMap.set("00002ab6-0000-1000-8000-00805f9b34fb", "URI");
		characteristicMap.set("00002ab7-0000-1000-8000-00805f9b34fb", "HTTP Headers");
		characteristicMap.set("00002ab8-0000-1000-8000-00805f9b34fb", "HTTP Status Code");
		characteristicMap.set("00002ab9-0000-1000-8000-00805f9b34fb", "HTTP Entity Body");
		characteristicMap.set("00002aba-0000-1000-8000-00805f9b34fb", "HTTP Control Point");
		characteristicMap.set("00002abb-0000-1000-8000-00805f9b34fb", "HTTPS Security");
		characteristicMap.set("00002abc-0000-1000-8000-00805f9b34fb", "TDS Control Point");
		characteristicMap.set("00002abd-0000-1000-8000-00805f9b34fb", "OTS Feature");
		characteristicMap.set("00002abe-0000-1000-8000-00805f9b34fb", "Object Name");
		characteristicMap.set("00002abf-0000-1000-8000-00805f9b34fb", "Object Type");
		characteristicMap.set("00002ac0-0000-1000-8000-00805f9b34fb", "Object Size");
		characteristicMap.set("00002ac1-0000-1000-8000-00805f9b34fb", "Object First-Created");
		characteristicMap.set("00002ac2-0000-1000-8000-00805f9b34fb", "Object Last-Modified");
		characteristicMap.set("00002ac3-0000-1000-8000-00805f9b34fb", "Object ID");
		characteristicMap.set("00002ac4-0000-1000-8000-00805f9b34fb", "Object Properties");
		characteristicMap.set("00002ac5-0000-1000-8000-00805f9b34fb", "Object Action Control Point");
		characteristicMap.set("00002ac6-0000-1000-8000-00805f9b34fb", "Object List Control Point");
		characteristicMap.set("00002ac7-0000-1000-8000-00805f9b34fb", "Object List Filter");
		characteristicMap.set("00002ac8-0000-1000-8000-00805f9b34fb", "Object Changed");
		characteristicMap.set("00002ac9-0000-1000-8000-00805f9b34fb", "Resolvable Private Address Only");
		characteristicMap.set("00002acc-0000-1000-8000-00805f9b34fb", "Fitness Machine Feature");
		characteristicMap.set("00002acd-0000-1000-8000-00805f9b34fb", "Treadmill Data");
		characteristicMap.set("00002ace-0000-1000-8000-00805f9b34fb", "Cross Trainer Data");
		characteristicMap.set("00002acf-0000-1000-8000-00805f9b34fb", "Step Climber Data");
		characteristicMap.set("00002ad0-0000-1000-8000-00805f9b34fb", "Stair Climber Data");
		characteristicMap.set("00002ad1-0000-1000-8000-00805f9b34fb", "Rower Data");
		characteristicMap.set("00002ad2-0000-1000-8000-00805f9b34fb", "Indoor Bike Data");
		characteristicMap.set("00002ad3-0000-1000-8000-00805f9b34fb", "Training Status");
		characteristicMap.set("00002ad4-0000-1000-8000-00805f9b34fb", "Supported Speed Range");
		characteristicMap.set("00002ad5-0000-1000-8000-00805f9b34fb", "Supported Inclination Range");
		characteristicMap.set("00002ad6-0000-1000-8000-00805f9b34fb", "Supported Resistance Level Range");
		characteristicMap.set("00002ad7-0000-1000-8000-00805f9b34fb", "Supported Heart Rate Range");
		characteristicMap.set("00002ad8-0000-1000-8000-00805f9b34fb", "Supported Power Range");
		characteristicMap.set("00002ad9-0000-1000-8000-00805f9b34fb", "Fitness Machine Control Point");
		characteristicMap.set("00002ada-0000-1000-8000-00805f9b34fb", "Fitness Machine Status");
		characteristicMap.set("00002aed-0000-1000-8000-00805f9b34fb", "Date UTC");
		characteristicMap.set("00002b1d-0000-1000-8000-00805f9b34fb", "RC Feature");
		characteristicMap.set("00002b1e-0000-1000-8000-00805f9b34fb", "RC Settings");
		characteristicMap.set("00002b1f-0000-1000-8000-00805f9b34fb", "Reconnection Configuration Control Point");

		// To be completed
		const characteristicInStringMap =  [
			'00002a29-0000-1000-8000-00805f9b34fb',
			'00002a24-0000-1000-8000-00805f9b34fb',
			'00002a25-0000-1000-8000-00805f9b34fb'
		];


		// ##############
		// # Start scan #
		// ##############
		try {
            // Log start scanBLE
            var BluetoothLeScanner = Java.use('android.bluetooth.le.BluetoothLeScanner');
            BluetoothLeScanner.startScan.overload('android.bluetooth.le.ScanCallback').implementation = function() {
				BluetoothLeScanner.startScan.apply(this, arguments);
				console.log('BluetoothLeScanner.startScan called (1)');
			  }
        } catch (err) {
            console.log('[-] BluetoothLeScanner.startScan {1} pinner not found');
			console.log(err);
        }
		
		try {
            // Log start scanBLE
            var BluetoothLeScanner = Java.use('android.bluetooth.le.BluetoothLeScanner');
            BluetoothLeScanner.startScan.overload('java.util.List', 'android.bluetooth.le.ScanSettings', 'android.app.PendingIntent').implementation = function() {
				const returnValue = BluetoothLeScanner.startScan.apply(this, arguments);
				console.log('BluetoothLeScanner.startScan called (2)');
				return returnValue;
			  }
        } catch (err) {
            console.log('[-] BluetoothLeScanner.startScan {2} pinner not found');
			console.log(err);
        }
		
		try {
            // Log start scanBLE
            var BluetoothLeScanner = Java.use('android.bluetooth.le.BluetoothLeScanner');
            BluetoothLeScanner.startScan.overload('java.util.List', 'android.bluetooth.le.ScanSettings', 'android.bluetooth.le.ScanCallback').implementation = function() {
				BluetoothLeScanner.startScan.apply(this, arguments);
				console.log('BluetoothLeScanner.startScan called (3)');
			  }
        } catch (err) {
            console.log('[-] BluetoothLeScanner.startScan {3} pinner not found');
			console.log(err);
        }
		
		try {
            // Log start scanBLE
            var BluetoothLeScanner = Java.use('android.bluetooth.le.BluetoothLeScanner');
            BluetoothLeScanner.startScan.overload('java.util.List', 'android.bluetooth.le.ScanSettings', 'android.os.WorkSource', 'android.bluetooth.le.ScanCallback', 'android.app.PendingIntent', 'java.util.List').implementation = function() {
				const returnValue = BluetoothLeScanner.startScan.apply(this, arguments);
				console.log('BluetoothLeScanner.startScan called (4)');
				return returnValue;
			  }
        } catch (err) {
            console.log('[-] BluetoothLeScanner.startScan {4} pinner not found');
			console.log(err);
        }


		// ##############
		// # Stop scan #
		// ##############
		try {
            // Log stop scanBLE
            var BluetoothLeScanner = Java.use('android.bluetooth.le.BluetoothLeScanner');
            BluetoothLeScanner.stopScan.overload('android.bluetooth.le.ScanCallback').implementation = function() {
				BluetoothLeScanner.stopScan.apply(this, arguments);
				console.log('BluetoothLeScanner.stopScan called (1)');
			  }
        } catch (err) {
            console.log('[-] BluetoothLeScanner.stopScan {1} pinner not found');
			console.log(err);
        }
		
		try {
            // Log start stop scanBLE
            var BluetoothLeScanner = Java.use('android.bluetooth.le.BluetoothLeScanner');
            BluetoothLeScanner.stopScan.overload('android.app.PendingIntent').implementation = function() {
				BluetoothLeScanner.stopScan.apply(this, arguments);
				console.log('BluetoothLeScanner.stopScan called (2)');
			  }
        } catch (err) {
            console.log('[-] BluetoothLeScanner.stopScan {2} pinner not found');
			console.log(err);
        }
		
		// ###############
		// # Scan result #
		// ###############
		try {
            var ScanCallback = Java.use('android.bluetooth.le.ScanCallback');
            ScanCallback.onScanResult.overload('int', 'android.bluetooth.le.ScanResult').implementation = function(callbackType, result) {
				//ScanCallback.onScanResult.apply(this, arguments);
				console.log('ScanCallback.onScanResult called (1)');
				return this.onScanResult.overload('int', 'android.bluetooth.le.ScanResult').call(this, callbackType, result);
			  }
        } catch (err) {
            console.log('[-] ScanCallback.onScanResult {1} pinner not found');
			console.log(err);
        }
		
		try {
            var ScanCallback = Java.use('android.bluetooth.le.ScanCallback');
            ScanCallback.onScanFailed.overload('int').implementation = function(errorCode) {
				ScanCallback.onScanFailed.apply(this, arguments);
				console.log('ScanCallback.onScanFailed called (1)');
			  }
        } catch (err) {
            console.log('[-] ScanCallback.onScanFailed {1} pinner not found');
			console.log(err);
        }

// TODO
//        .overload('android.content.Context', 'boolean', 'android.bluetooth.BluetoothGattCallback')
//        .overload('android.content.Context', 'boolean', 'android.bluetooth.BluetoothGattCallback', 'int')
//        .overload('android.content.Context', 'boolean', 'android.bluetooth.BluetoothGattCallback', 'int', 'int')
//        .overload('android.content.Context', 'boolean', 'android.bluetooth.BluetoothGattCallback', 'int', 'int', 'android.os.Handler')
//        .overload('android.content.Context', 'boolean', 'android.bluetooth.BluetoothGattCallback', 'int', 'boolean', 'int', 'android.os.Handler')

		try {
            var BluetoothDevice = Java.use('android.bluetooth.BluetoothDevice');
            BluetoothDevice.connectGatt.overload('android.content.Context', 'boolean', 'android.bluetooth.BluetoothGattCallback').implementation = function(context, autoConnect, callback) {
				const returnValue = BluetoothDevice.connectGatt.apply(this, arguments);
				console.log('BluetoothDevice.connectGatt called on (' + this + ')');
				return returnValue;
			  }
        } catch (err) {
            console.log('[-] BluetoothDevice.connectGatt {1} pinner not found');
			console.log(err);
        }
		
		try {
            var BluetoothGatt = Java.use('android.bluetooth.BluetoothGatt');
            BluetoothGatt.discoverServices.implementation = function() { // NO parameters
				const returnValue = BluetoothGatt.discoverServices.apply(this, arguments);
				console.log('BluetoothGatt.discoverServices called (1)');
				return returnValue;
			  }
        } catch (err) {
            console.log('[-] BluetoothGatt.discoverServices {1} pinner not found');
			console.log(err);
        }
		
		try {
            var BluetoothGatt = Java.use('android.bluetooth.BluetoothGatt');
            BluetoothGatt.close.implementation = function() { // NO parameters
				BluetoothGatt.close.apply(this, arguments);
				console.log('BluetoothGatt.close called (1)');
			  }
        } catch (err) {
            console.log('[-] BluetoothGatt.close {1} pinner not found');
			console.log(err);
        }
		
		// TODO
		// .overload('java.util.UUID')
        // .overload('android.bluetooth.BluetoothDevice', 'java.util.UUID', 'int')

		try {
            var BluetoothGatt = Java.use('android.bluetooth.BluetoothGatt');
            BluetoothGatt.getService.overload('java.util.UUID').implementation = function(uuid) {
				const returnValue = BluetoothGatt.getService.apply(this, arguments);
				console.log('BluetoothGatt.getService called (' + uuid + ' [' + serviceMap.get(uuid.toString()) + '])');
				return returnValue;
			  }
        } catch (err) {
            console.log('[-] BluetoothGatt.getService {1} pinner not found');
			console.log(err);
        }

		try {
            var BluetoothGatt = Java.use('android.bluetooth.BluetoothGatt');
            BluetoothGatt.readCharacteristic.implementation = function(characteristic) { // BluetoothGattCharacteristic
				const returnValue = BluetoothGatt.readCharacteristic.apply(this, arguments);
				console.log('BluetoothGatt.readCharacteristic called (' + characteristic.getUuid() + ' [' + characteristicMap.get(characteristic.getUuid().toString()) + ']) => ' + returnValue);
				return returnValue;
			  }
        } catch (err) {
            console.log('[-] BluetoothGatt.readCharacteristic {1} pinner not found');
			console.log(err);
        }
		
		try {
            var BluetoothGatt = Java.use('android.bluetooth.BluetoothGatt');
            BluetoothGatt.setCharacteristicNotification.implementation = function(characteristic, enable) { //BluetoothGattCharacteristic, boolean
				const returnValue = BluetoothGatt.setCharacteristicNotification.apply(this, arguments);
				console.log('BluetoothGatt.setCharacteristicNotification called (' + characteristic.getUuid() + ' [' + characteristicMap.get(characteristic.getUuid().toString()) + '], ' + enable + ') => ' + returnValue);
				return returnValue;
			  }
        } catch (err) {
            console.log('[-] BluetoothGatt.setCharacteristicNotification {1} pinner not found');
			console.log(err);
        }

		// Deprecated: writeCharacteristic(BluetoothGattCharacteristic characteristic)
		// Use : writeCharacteristic(BluetoothGattCharacteristic characteristic, byte[] value, int writeType) 
		try {
            var BluetoothGatt = Java.use('android.bluetooth.BluetoothGatt');
            BluetoothGatt.writeCharacteristic.implementation = function(characteristic) {
				const returnValue = BluetoothGatt.writeCharacteristic.apply(this, arguments);
				console.log('BluetoothGatt.writeCharacteristic called (' + characteristic.getUuid() + ')');
				return returnValue;
			  }
        } catch (err) {
            console.log('[-] BluetoothGatt.writeCharacteristic {1} pinner not found');
			console.log(err);
        }



		try {
			var BluetoothDevice = Java.use('android.bluetooth.BluetoothDevice');
			BluetoothDevice.getName.implementation = function() {
				const returnValue = BluetoothDevice.getName.apply(this, arguments);
				console.log('BluetoothDevice.getName ' + returnValue);
				return returnValue;
			}
		} catch (err) {
			console.log('[-] BluetoothDevice.getName {1} pinner not found');
			console.log(err);
		}


		try {
			var BluetoothGattCharacteristic = Java.use('android.bluetooth.BluetoothGattCharacteristic');
			BluetoothGattCharacteristic.getValue.implementation = function() {
				const returnValue = BluetoothGattCharacteristic.getValue.apply(this, arguments);
				//console.log('BluetoothGattCharacteristic.getValue()');
				// console.log('raw value:   \t' + returnValue);
				if(characteristicInStringMap.includes(this.getUuid().toString())){
					console.log('BluetoothGattCharacteristic.getValue() ASCII value: \t' + toAsciiString(returnValue));
				} else {
					console.log('BluetoothGattCharacteristic.getValue() HEX value:   \t' + toHexString(returnValue));
				}
				return returnValue;
			}
		} catch (err) {
			console.log('[-] BluetoothGattCharacteristic.getValue {1} pinner not found');
			console.log(err);
		}

    });

}, 0);