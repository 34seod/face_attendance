class RegistedMailer < ApplicationMailer
  def registed_email
    @user = params[:user]
    mail(to: "aaa@gmail.com", subject: "얼굴등록완료")
  end
end
