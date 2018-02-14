# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
i = 1
while i < 100
  Card.create!(title: "title#{i}", image: 'https://wallpaperbrowse.com/media/images/gecko-2299365_960_720.jpg', description: "It is a long long long description number #{i}")
  Card.create!(title: "title#{i + 1}", image: 'https://wallpaperbrowse.com/media/images/p0585f4a.jpg', description: "It is a long long long description number #{i + 1}")
  Card.create!(title: "title#{i + 2}", image: 'https://wallpaperbrowse.com/media/images/pexels-photo-340742.jpeg', description: "It is a long long long description number #{i + 2}")
  Card.create!(title: "title#{i + 3}", image: 'https://wallpaperbrowse.com/media/images/aE3uhPPr.jpg', description: "It is a long long long description number #{i + 3}")
  Card.create!(title: "title#{i + 4}", image: 'https://wallpaperbrowse.com/media/images/nature-images-28.jpg', description: "It is a long long long description number #{i + 4}")
  i = i + 5
end