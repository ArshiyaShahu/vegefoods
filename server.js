const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/vegefoods');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database!');
});

//define schema and model categoryadd
const categorySchema = new mongoose.Schema({
  Name: { type: String, required: true, unique: true, trim: true },
});

const categoryadd = mongoose.model('category_master', categorySchema);

// Serve the categoryadd page from the admin directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'categoryadd.html'));
});

app.post('/post', async (req, res) => { // Marked as async
  console.log('Received data:', req.body);
  const { Name } = req.body;

  try {
    const user = new categoryadd({
      Name,
    });

    await user.save();
    console.log('categoryadd saved:', user);
    res.send('category added successfully!');
  } catch (error) {
    console.error('Error saving categoryadd:', error);
    res.status(500).send('Error saving categoryadd data. Please try again later.');
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
