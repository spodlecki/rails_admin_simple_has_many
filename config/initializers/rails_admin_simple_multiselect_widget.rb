class RailsAdminSimpleMultiselect < RailsAdmin::Config::Fields::Types::HasManyAssociation
  # # Register field type for the type loader
  RailsAdmin::Config::Fields::Types.register(:simple_multiselect, RailsAdminSimpleMultiselect)

  register_instance_option :partial do
    :form_simple_multiselect
  end

  register_instance_option :inline_delete do
    true
  end
end
