namespace :fetch_usgs_data do
    desc "Fetch seismic data from USGS and persist in the database"
    task fetch: :environment do
      require 'httparty'
      require 'json'
  
      url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
      response = HTTParty.get(url)
  
      if response.code == 200
        data = JSON.parse(response.body)
        features = data['features']
  
        features.each do |feature|
          properties = feature['properties']
          geometry = feature['geometry']
  
          next if properties['title'].nil? || properties['url'].nil? || properties['place'].nil? || properties['magType'].nil? || geometry['coordinates'].nil?
  
          longitude = geometry['coordinates'][0]
          latitude = geometry['coordinates'][1]
  
          next if longitude.nil? || latitude.nil?
  
          # Validation of ranges
          if properties['mag'] < -1.0 || properties['mag'] > 10.0 ||
             latitude < -90.0 || latitude > 90.0 ||
             longitude < -180.0 || longitude > 180.0
            #puts "Advertencia: Los valores de magnitud, latitud o longitud están fuera de rango."
            next
          end
  
          Feature.find_or_create_by(external_id: feature['id']) do |event|
            event.magnitude = properties['mag']
            event.place = properties['place']
            event.time = Time.at(properties['time'] / 1000)
            event.url = properties['url']
            event.tsunami = properties['tsunami']
            event.mag_type = properties['magType']
            event.title = properties['title']
            event.longitude = longitude
            event.latitude = latitude
          end
        end
      else
        puts "Error getting data: #{response.code}"
      end
    end
  end