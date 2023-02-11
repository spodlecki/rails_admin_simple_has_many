$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "rails_admin_simple_has_many/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "rails_admin_simple_has_many"
  s.version     = RailsAdminSimpleHasMany::VERSION
  s.authors     = ["Aiman Najjar"]
  s.email       = ["aiman.najjar@hurranet.com"]
  s.homepage    = "http://github.com/aiman86/rails_admin_simple_has_many"
  s.summary     = "A RailsAdmin field type that renders a simpler has_many field"
  s.description = "Simple Has Many Widget is a RailsAdmin plugin that enables a simpler has_many field than original one (i.e. single list with support for inline add and delete)"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency 'rails', ['>= 4.0']
  s.add_dependency 'js-routes', '~> 1.2', '>= 1.2.4'
end
