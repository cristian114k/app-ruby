class Api::CommentsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index       
      begin
        feature = Feature.find(params[:feature_id])
        @comments = feature.comments
        if @comments.empty?
          render json: { message: "This feature doesn't have any comments yet." }
        else
          render json: CommentSerializer.new(@comments)
        end
      rescue ActiveRecord::RecordNotFound => e
        render json: { error: "Feature with id #{params[:feature_id]} not found" }, status: :not_found
      end
    end

    def create
        begin
            feature = Feature.find(params[:feature_id])
            comment = feature.comments.build(comment_params)
      
            if comment.save
              render json: comment, status: :created
            else
              render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
            end
          rescue ActiveRecord::RecordNotFound => e
            render json: { error: "Feature with id #{params[:feature_id]} not found" }, status: :not_found
          end
    end

    private

    def comment_params
      params.require(:comment).permit(:body)
    end
end
