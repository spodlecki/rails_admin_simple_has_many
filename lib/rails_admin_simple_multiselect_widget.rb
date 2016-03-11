module RailsAdminSimpleMultiselectWidget
  class Engine < Rails::Engine
    initializer 'RailsAdmin precompile hook', group: :all do |app|
      app.config.assets.precompile += %w( rails_admin/ra.simple-multiselect.js )
    end
  end
end
