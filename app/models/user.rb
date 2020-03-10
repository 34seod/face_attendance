# == Schema Information
#
# Table name: users
#
#  id         :bigint           not null, primary key
#  email      :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class User < ApplicationRecord
  # Associations ----------------------------------------------------------------------------------

  # Validations -----------------------------------------------------------------------------------
  validates :name,  presence: { message: I18n.t("error.required") }
  validates :email, presence: { message: I18n.t("error.required") }, uniqueness: { message: I18n.t("error.uniq") }

  # Scopes ----------------------------------------------------------------------------------------

  # Alias or Alias Methods or Alias Attribute -----------------------------------------------------

  # Callbacks -------------------------------------------------------------------------------------

  # Enums -----------------------------------------------------------------------------------------

  # Class Methods ---------------------------------------------------------------------------------

  # Instance Methods ------------------------------------------------------------------------------
end
