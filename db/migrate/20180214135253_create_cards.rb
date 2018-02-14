class CreateCards < ActiveRecord::Migration[5.1]
  def change
    create_table :cards do |t|
      t.string :title
      t.string :image
      t.string :description

      t.timestamps
    end
  end
end
