# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
i = 1
while i < 100
  Card.create!(title: "title#{i}", image: '1.jpg', description: "It is a long long long description number #{i}", orderN: i)
  Card.create!(title: "title#{i + 1}", image: '2.jpg', description: "It is a long long long description number #{i + 1}", orderN: (i+1))
  Card.create!(title: "title#{i + 2}", image: '3.jpg', description: "It is a long long long description number #{i + 2}", orderN: (i+2))
  Card.create!(title: "title#{i + 3}", image: '4.jpg', description: "It is a long long long description number #{i + 3}", orderN: (i+3))
  i = i + 4
end