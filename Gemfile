source "https://rubygems.org"

# Core Rails gems
gem "rails", "~> 7.1.0"
gem "puma", "~> 6.0"
gem "sqlite3", "~> 1.6"  # Use PostgreSQL in production

# API and CORS support
gem "rack-cors"
gem "jbuilder"

# Frontend integration
gem "webpacker", "~> 5.4"  # If using Webpacker

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem "rspec-rails"
  gem "factory_bot_rails"
end

group :development do
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

