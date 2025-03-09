class Api::MessagesController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def index
    @messages = Message.order(created_at: :asc).last(50)
    render json: @messages
  end
  
  def create
    @message = Message.new(message_params)
    
    if @message.save
      render json: @message, status: :created
    else
      render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def message_params
    params.require(:message).permit(:content, :username)
  end
end

