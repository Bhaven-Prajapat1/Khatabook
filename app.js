const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

//setting view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// To show all the collection of user
app.get("/", (req, res) => {
  fs.readdir("./hisaab", function (err, files) {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.render("index", { files: files });
  });
});

// Creating collection
app.get("/create", (req, res) => {
  res.render("create");
});
// post collection route
app.post("/create", (req, res) => {
  let currentdate = new Date();
  let date = `${currentdate.getDate()}-${
    currentdate.getMonth() + 1
  }-${currentdate.getFullYear()}`;

  fs.writeFile(`./hisaab/${date}.txt`, req.body.content, function (err) {
    if (err) return res.status(404).json({ message: "Something went wrong" });
    res.redirect("/");
  });
});

// edit the hisaab
app.get("/edit/:filename", (req, res) => {
  fs.readFile(
    `./hisaab/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      if (err) return res.status(404).json({ message: "File not found" });
      res.render("edit", { filedata, filename: req.params.filename });
    }
  );
});
// upadating the file
app.post("/update/:filename", (req, res) => {
  fs.writeFile(
    `./hisaab/${req.params.filename}`,
    req.body.content,
    function (err) {
      if (err) return res.status(500).json("Failed to update the file");
      res.redirect("/");
    }
  );
});

// showing the hisaab to the user
app.get('/hisaab/:filename', function(req,res){
  fs.readFile(`./hisaab/${req.params.filename}`,req.body.content, function(err, filedata){
    if(err) return res.status(500).json({message:"Server error"})
      res.render('hisaab', {filedata, filename: req.params.filename});
  })
})

//deleting the file
app.get('/delete/:filename', (req,res)=>{
  fs.unlink(`./hisaab/${req.params.filename}`, function(err){
    if(err) return res.status(500).json({message:"File not deleted"})
      res.redirect('/');
  })
})
app.listen(3000);
