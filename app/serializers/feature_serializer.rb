class FeatureSerializer
  include FastJsonapi::ObjectSerializer

  set_type :feature
  attributes :id, :external_id, :magnitude, :place, :time, :tsunami, :mag_type, :title
  attribute :coordinates do |object|
    {
      longitude: object.longitude,
      latitude: object.latitude
    }
  end

  link :external_url do |object|
    object.external_url
  end
  
end
