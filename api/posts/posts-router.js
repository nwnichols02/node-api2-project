// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

// router.get('/', (req, res) => {
//     res.send('Howdy sir!')
// })

router.get("/", (req, res) => {
  console.log(req.body);
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert({ title, contents })
      .then(({ id }) => {
        return Posts.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/:id", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Posts.findById(req.params.id)
      .then((posts) => {
        if (!posts) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          return Posts.update(req.params.id, req.body);
        }
      })
      .then((blah) => {
        if (blah) {
          return Posts.findById(req.params.id);
        }
        // res.status(200).json(blah);
      })
      .then((post) => {
        if (post) {
          res.status(200).json(post);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "The post information could not be modified",
        });
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const huh = await Posts.findById(req.params.id);
    if (!huh) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await Posts.remove(req.params.id);
      res.json(huh);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "The post could not be removed",
    });
  }
});

router.get("/:id/messages", async (req, res) => {
  try {
    const post = await Posts.findCommentById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const messages = await Posts.findPostComments(req.params.id);
      res.json(messages);
    }
  } catch (err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
    });
  }
});
module.exports = router;
