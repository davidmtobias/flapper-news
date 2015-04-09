var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});



PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

//Llevo 15 días con un error de "function is not defined". Resulta que la publicación del model Post lo hacía
//antes de la definición del método "upvote" de arriba, con lo que el método "upvote" se conocía.
mongoose.model('Post', PostSchema);
