module RailsAdminSimpleHasMany
  class SimpleHasManyType < RailsAdmin::Config::Fields::Types::HasManyAssociation
    # # Register field type for the type loader
    RailsAdmin::Config::Fields::Types.register(:simple_has_many, self)
    register_instance_option :partial do
      :form_simple_has_many
    end

    register_instance_option :nested_form do
      false
    end
  end
end