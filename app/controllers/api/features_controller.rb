module Api
  class FeaturesController < ApplicationController
    def index

      response.headers['Content-Type'] = 'application/vnd.api+json'
      response.headers['cache-control'] = 'no-cache'
      
      features = Feature.all

      # Filter
      if params[:mag_type].is_a?(Array)
        features = features.where(mag_type: params[:mag_type])
      elsif params[:mag_type].present?
        features = features.where(mag_type: [params[:mag_type]])
      end

      # Pagination
      @features = features.paginate(page: params[:page], per_page: params[:per_page] || 1000)

      render json: {
        data: FeatureSerializer.new(@features).as_json["data"],
        pagination: {
          current_page: @features.current_page,
            total: @features.total_entries,
            per_page: @features.per_page           
        }
      }

    end
  end
end

  
  