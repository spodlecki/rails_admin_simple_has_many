require 'rails_admin/config/fields/association'

module RailsAdminSimpleMultiselectWidget
  module Config
    module Fields
      module Types
        class RailsAdminSimpleMultiselect < RailsAdmin::Config::Fields::Types::HasManyAssociation
          RailsAdmin::Config::Fields::Types.register(:simple_multiselect, self)
        end
      end
    end
  end
end
