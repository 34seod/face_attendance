FROM ruby:2.6.3
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y nodejs yarn python3-pip ffmpeg postgresql-client redis-server
RUN pip3 install opencv-python==3.4.9.31 opencv-contrib-python pillow

ENV APP_ROOT /usr/src/app

WORKDIR ${APP_ROOT}
ADD Gemfile ${APP_ROOT}/Gemfile
ADD Gemfile.lock ${APP_ROOT}/Gemfile.lock
RUN bundle check || bundle install

# COPY package.json ${APP_ROOT}/
# COPY yarn.lock ${APP_ROOT}/
# RUN yarn install --check-files

COPY . ${APP_ROOT}

# EXPOSE 3000
# CMD foreman start