module RailsAdminSimpleHasMany

  class Engine < Rails::Engine
    initializer 'RailsAdmin Simple Has Many precompile hook', group: :all do |app|
      app.config.assets.precompile += %w( rails_admin/routes.js rails_admin/ra.simple-has-many.js )
    end
  end


end
