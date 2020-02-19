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
  validates :name,       presence: { message: I18n.t("error.required") }
  validates :company_id, presence: { message: I18n.t("error.required") }, uniqueness: { message: I18n.t("error.uniq") }
  validates :nfc_id,     presence: { message: I18n.t("error.required") }, uniqueness: { message: I18n.t("error.uniq") }

  # Scopes ----------------------------------------------------------------------------------------

  # Alias or Alias Methods or Alias Attribute -----------------------------------------------------

  # Callbacks -------------------------------------------------------------------------------------

  # Enums -----------------------------------------------------------------------------------------

  # Class Methods ---------------------------------------------------------------------------------

  # Instance Methods ------------------------------------------------------------------------------
end
