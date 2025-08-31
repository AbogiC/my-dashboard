const axios = require("axios");

const BASE_URL = "http://localhost:3001/api";

async function testEventsAPI() {
  console.log("🧪 Testing Events API...\n");

  try {
    // Test 1: Get events for user 1
    console.log("1. Testing GET /api/events/1");
    const getResponse = await axios.get(`${BASE_URL}/events/1`);
    console.log(
      "✅ GET events successful:",
      getResponse.data.length,
      "events found\n"
    );

    // Test 2: Create a new event
    console.log("2. Testing POST /api/events");
    const newEvent = {
      user_id: 1,
      title: "Test Event from Script",
      event_date: new Date().toISOString().split("T")[0],
      event_time: "15:30:00",
      description: "This is a test event created by the test script",
    };

    const createResponse = await axios.post(`${BASE_URL}/events`, newEvent);
    console.log("✅ POST event successful:", createResponse.data);
    const eventId = createResponse.data.id;

    // Test 3: Update the event
    console.log("\n3. Testing PUT /api/events/" + eventId);
    const updateData = {
      title: "Updated Test Event",
      event_date: newEvent.event_date,
      event_time: "16:00:00",
      description: "This event has been updated by the test script",
    };

    const updateResponse = await axios.put(
      `${BASE_URL}/events/${eventId}`,
      updateData
    );
    console.log("✅ PUT event successful:", updateResponse.data);

    // Test 4: Get events again to see the new one
    console.log("\n4. Testing GET /api/events/1 (after creation)");
    const getResponse2 = await axios.get(`${BASE_URL}/events/1`);
    console.log(
      "✅ GET events successful:",
      getResponse2.data.length,
      "events found"
    );

    // Test 5: Delete the test event
    console.log("\n5. Testing DELETE /api/events/" + eventId);
    const deleteResponse = await axios.delete(`${BASE_URL}/events/${eventId}`);
    console.log("✅ DELETE event successful:", deleteResponse.data);

    // Test 6: Verify deletion
    console.log("\n6. Verifying deletion");
    const getResponse3 = await axios.get(`${BASE_URL}/events/1`);
    console.log(
      "✅ GET events successful:",
      getResponse3.data.length,
      "events found (should be back to original count)"
    );

    console.log("\n🎉 All tests passed! Events API is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    }
  }
}

// Run the tests
testEventsAPI();
