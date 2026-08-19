const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const complaintsFile = "./complaints.json";

function readComplaints() {
    const data = fs.readFileSync(complaintsFile, "utf8");
    return JSON.parse(data);
}

function writeComplaints(complaints) {
    fs.writeFileSync(
        complaintsFile,
        JSON.stringify(complaints, null, 2)
    );
}

app.get("/", (req, res) => {
    res.json({
        message: "CampusCare Backend Running"
    });
});
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "CampusCare API is working"
    });
});
app.post("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "POST API is working"
    });
});app.post("/api/complaint", (req, res) => {
    const { category, description, location } = req.body;

    if (!category || !description || !location) {
        return res.status(400).json({
            success: false,
            message: "Category, description and location are required"
        });
    }

    const complaints = readComplaints();

    const newComplaint = {
        id: "C" + Date.now(),
        category: category,
        description: description,
        location: location,
        status: "Pending",
        supportCount: 0
    };

    complaints.push(newComplaint);

    writeComplaints(complaints);

    res.status(201).json({
        success: true,
        message: "Complaint submitted successfully",
        complaint: newComplaint
    });
});
app.get("/api/complaints", (req, res) => {
   
 const complaints = readComplaints();

    res.status(200).json({
        success: true,
        complaints: complaints
    });
});
app.post("/api/complaints/:id/support", (req, res) => {
    const complaints = readComplaints();

    const complaint = complaints.find(
        (item) => item.id === req.params.id
    );

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found"
        });
    }

    complaint.supportCount += 1;

    writeComplaints(complaints);

    res.status(200).json({
        success: true,
        message: "Complaint supported successfully",
        complaint: complaint
    });
});
app.patch("/api/complaints/:id/status", (req, res) => {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "In Progress", "Resolved"];

    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }

    const complaints = readComplaints();

    const complaint = complaints.find(
        (item) => item.id === req.params.id
    );

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found"
        });
    }

    complaint.status = status;

    writeComplaints(complaints);

    res.status(200).json({
        success: true,
        message: "Complaint status updated successfully",
        complaint: complaint
    });
});
app.listen(5000, () => {
    console.log("CampusCare Backend started on port 5000");
});