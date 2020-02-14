# == Schema Information
#
# Table name: users
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  company_id :bigint
#  nfc_id     :string           not null
#

class User < ApplicationRecord
  # Associations ----------------------------------------------------------------------------------

  # Validations -----------------------------------------------------------------------------------
  validates :name,       presence: true
  validates :company_id, presence: true, uniqueness: true
  validates :nfc_id,     presence: true, uniqueness: true

  # Scopes ----------------------------------------------------------------------------------------

  # Alias or Alias Methods or Alias Attribute -----------------------------------------------------

  # Callbacks -------------------------------------------------------------------------------------

  # Enums -----------------------------------------------------------------------------------------

  # Class Methods ---------------------------------------------------------------------------------

  # Instance Methods ------------------------------------------------------------------------------
end
