import routes from "../routes";
import Videos from "../models/Videos";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Videos.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term },
  } = req;
  let videos = [];
  try {
    videos = await Videos.find({ title: { $regex: term, $options: "i" } });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", term, videos });
};

export const getUpload = async (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  const newVideo = await Videos.create({
    fileUrl: location,
    title,
    description,
    creator: req.user._id,
  });
  req.user.video.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Videos.findById(id)
      .populate("creator")
      .populate("comment");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Videos.findById(id);
    if (video.creator.toString() !== req.user._id.toString()) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Videos.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Videos.findById(id);
    console.log(video.creator, req.user._id);
    if (video.creator.toString() !== req.user._id.toString()) {
      throw Error();
    } else {
      await Videos.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Videos.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Videos.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user._id,
    });
    video.comment.push(newComment._id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
  } = req;
  try {
    const video = await Videos.findById(id).populate("comment");
    console.log(video.creator);
    const commentIndex = video.comment.indexOf({ text: comment });
    const deleteComment = video.comment.splice(commentIndex, 1);
    video.save();
    const commentId = deleteComment[0]._id;
    await Comment.findByIdAndDelete({ _id: commentId });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
