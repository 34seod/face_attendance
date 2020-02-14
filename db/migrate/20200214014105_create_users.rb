class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.bigint :company_id, nulll: false
      t.string :nfc_id,     null: false
      t.string :name,       null: false
      t.timestamps
    end
  end
end
