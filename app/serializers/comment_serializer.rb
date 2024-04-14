class CommentSerializer
  include FastJsonapi::ObjectSerializer
  attributes :body, :feature_id
end
