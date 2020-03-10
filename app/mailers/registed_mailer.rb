class RegistedMailer < ApplicationMailer
  def registed_email
    @user = User.find(params[:user_id])
    mail(to: @user.email, subject: "얼굴등록완료")
  end
end
