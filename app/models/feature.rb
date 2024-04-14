class Feature < ApplicationRecord
    include WillPaginate::CollectionMethods

    has_many :comments
end
